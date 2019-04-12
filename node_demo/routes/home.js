//var express = require("express");
import express from 'express';
import Promise from 'bluebird';
var router = express.Router();
//var User = global.dbHandel.getModel("mydbdata");
var path = require('path');
var fs = require('fs');
let readFile = Promise.promisify(fs.readFile);

router.get("/", function (req, res) {
  // testAsync();
  res.cookie("home_cookie", "haha", {
    signed: true,
    maxAge: 60 * 60,
    httpOnly: true,
    path: "/"
  });
  // 获取之前加密过的cookie，返回解密后的cookie
  console.log(req.signedCookies);

  if (!req.session.user) {
    //记录用户的请求路径,登录成功后返回当前页
    req.session.originalUrl = req.originalUrl ? req.originalUrl : null;
    //   req.session.error = "请先登录"
    res.redirect("/login"); //未登录则重定向到 /login 路径
  } else {
    res.locals.userObj = req.session.user;

    res.render("home", {
      title: "home"
    });

  }
}).get("/getUserList", function (req, res) {

  User.find({}, function (err, doc) {
    if (err) return res.status(500).json({
      code: 500,
      message: err.message
    });
    return res.status(200).json({
      code: 200,
      data: doc
    });
  });
}).post("/delete", function (req, res) {

  var name = req.body.name;
  User.findOneAndRemove({
    name: name
  }, function (err, user) {

    if (err) return res.status(500).json({
      code: 500,
      message: err.message
    });
    return res.status(200).json({
      code: 200,
      data: [user]
    });
  });


}).post('/update', function (req, res) {
  var name = req.body.name;
  User.find({
    name: name
  }, function (err, user) {
    if (err) {
      res.send({
        message: 'error'
      });
      return;
    }

    var aUser = user[0];
    // 更改属性
    aUser.age = 100;
    // save
    aUser.save(function (err, data) {
      if (err) {
        res.send({
          message: 'error'
        });
        return;
      }
      res.send({
        code: 200,
        data: [aUser]
      });
    });
  });
});

// async function testAsync(name) {
//   console.log("hello");
//   for (let i = 0; i < 3; i++) {
//       let fileContent = await readFile(path.join(__dirname, '../package.json'));
//       console.log(new Buffer(fileContent).toString());
//       console.log("=======");
//   }
//   console.log('endendendendendendend');
// }



module.exports = router;