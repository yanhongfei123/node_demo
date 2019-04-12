var express = require("express");
var path = require("path");
var favicon = require("serve-favicon");
var logger = require("morgan");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
var  chalk = require('chalk');
// 引入jwt token工具
const JwtUtil = require('./public/utils/jwt');

var session = require("express-session");
var multer = require("multer");
var mongoose = require("mongoose");
var MongoStore = require("connect-mongo")(session);

require("./database/db.js");

import fs from 'fs';


var app = express();
// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");

var hbs = require("hbs");
//使用局部模板要先注册
hbs.registerPartials(__dirname + "/views/common");
hbs.registerHelper("css", function (str, option) {
  var cssList = this.cssList || [];
  str = str.split(/[,，;；]/);
  console.log("css: ", str);
  str.forEach(function (item) {
    if (cssList.indexOf(item) < 0) {
      cssList.push(item);
    }
  });
  this.cssList = cssList.concat();
});

hbs.registerHelper("js", function (str, option) {
  var jsList = this.jsList || [];
  str = str.split(/[,，;；]/);
  console.log("js: ", str);
  str.forEach(function (item) {
    if (jsList.indexOf(item) < 0) {
      jsList.push(item);
    }
  });
  this.jsList = jsList.concat();
});


var secret = 'lifeissimpebutyoumadeitcomplicated';
app.use(favicon(path.join(__dirname, 'public/images', 'favicon.ico')));
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
})); //处理 form 表单形式提交的数据
app.use(bodyParser.json()); // 处理 ajax 形式提交的数据
// app.use(multer());
app.use(cookieParser(secret)); // 通过secret密钥来解密
app.use(express.static(path.join(__dirname, "public")));

app.use(
  session({
    // 表示cookie的name，默认cookie的name是：connect.sid。
    name: 'sesstioncookie',
    //与cookieParser中的一致,一个String类型的字符串，作为服务器端生成session的签名。
    secret: secret, // secret用来对设置了signed: true 的cookie签名加密
    resave: false, // 即使 session 没有被修改，也保存 session 值，默认为 true
    saveUninitialized: true, //强制将未初始化的 session 存储。  默认值是true  建议设置成true
    cookie: {
      // 原来是我没有开启https，而在代码中启用了secure为true，
      secure: false, //  当 secure 值为 true 时，cookie 在 HTTP 中是无效，在 HTTPS 中才有效
      maxAge: 10 * 1000   //  1000 * 60 * 60 * 24 * 5 // 默认浏览器关闭就失效 
    },
    // session 的存储方式，默认存放在内存中，也可以使用 redis，mongodb 等。
    //sesstion 存到 mongoDB数据库 
    store: new MongoStore({
      mongooseConnection: mongoose.connection, //使用已有的数据库连接
      // url: "mongodb://127.0.0.1:27017/yhf_db",
      // username:'', 
      // password :'',
      host: "localhost",
      port: 27017,
      collection: "sessions", // 存在哪个集合里，默认为sessions
      // 一般connect-mongo会使用session 里cookie设置的的过期时间为准，但是如果session 没设置的话，自己可以利用ttl属性来创建
      ttl: 60, //7*24*60*60, // session过期时间, 单位秒
      // connect-mongo会根据ttl来自动移除过期的session，
      autoRemove: "native", // mongo2.2+自动移除过期的session，disable为禁用
      // 对于老版本的不能配置ttl属性的connect-mongo，可以通过定义interval来移除过期的sessions
      //  autoRemoveInterval: 1, //移除过期session间隔时间,默认为1分钟
      touchAfter: 24 * 3600 // 通过设置，session只需一天更新一次，而不管有多少请求发送过来

    })
  })
);

var storge = multer.diskStorage({
  //设置上传后文件存放路径
  destination: function (req, file, cb) {
    cb(null, __dirname + "/public/images");
  },
  //给上传文件重命名，获取添加后缀名
  filename: function (req, file, cb) {
    var fileformat = file.originalname.split(".");
    cb(
      null,
      fileformat[0] + "-" + Date.now() + "." + fileformat[fileformat.length - 1]
    );
  }
});

//设置文件上传后的保存路径  保存到 public/upload 文件夹下
// array 第一个参数表示 = >多个相同 file文件的 name   如  ype="file" name="file"
// 添加配置文件到multer对象。
var upload = multer({
  storage: storge
});

import login from './routes/login';
import register from './routes/register';
import article from './routes/article';
import pachong from './routes/pachong';
import populate from './routes/populate';

// // 对请求接口进行拦截并校验token的合法性 , 必须定义在路由之前
app.all('/*', function (req, res, next) {
  console.log(
    chalk.green(JSON.stringify(req.session))
  );
  if (req.url != '/login' && req.url != '/register') {
    let token = req.headers.token;
    let jwt = new JwtUtil(token);
    jwt.verifyToken(function(token){
      console.log(
        chalk.green('token=====' + token)
      );
      next();
    }, function(){
      res.send({
        status: 0,
        msg: '登录已过期,请重新登录'
      });
    });
  } else {
    next();
  }
});

// 对请求接口进行拦截并校验token的合法性 , 必须定义在路由之前
// app.all('/*', function (req, res, next) {
//   console.log(
//     chalk.green(JSON.stringify(req.session))
//   );
//   if (req.url != '/login' && req.url != '/register') {
//     if(req.session && !req.session.user_id){
//       res.send({
//         status: 0,
//         msg: 'session过期'
//       }); 
//     }

//   } else {
//     next();
//   }
// });


app.use("/login", login);
app.use("/register", register);
app.use("/getArticle", article);
app.use("/getData", pachong);
app.use("/user", populate);
//爬虫测试
//var Ut = require("./common");
import Ut from './common';


if (process.env.NODE_ENV == 'development') {
  console.log(
    chalk.green('======development========')
  );
}


(async () => {
  try {
    let opts = {
      headers: {
        //'Referer': 'http://www.mzitu.com/',//防盗链
      },
      url: 'http://www.codeceo.com/',
    };
    //await Ut.downloadImg(opts);

  }
  catch (e) {
    console.log(e);
  }
})();

//Ut.downloadImg2(1)

fs.readFile('package.json', 'utf-8', function (err, content) {
  if (err) {
    // 一旦发生异常，一律交给error事件的handler处理
    console.log(error);
  }
  //fs.appenfFile通过异步的方式将文本内容或数据添加到文件里，如果文件不存在会自动创建。
  fs.appendFile('./demo.txt', content, 'utf-8', function (err) {
    if (err) {
        console.log(err);
    }
  });  

    //如果文件不存在会自动创建。
  // fs.writeFile('./output.txt', content, function(err){
  //   if(err) console.log('写文件操作失败');
  //   else console.log('写文件操作成功');
  // });

});


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error("Not Found");
  err.status = 404;
  next(err);
});


// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;