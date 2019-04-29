
var chalk = require('chalk')
var mongoose = require("mongoose");
// 连接数据库 ,数据库的名称可以是不存在 创建一个 datadbbase 数据库
//mongoose.connect("mongodb://yanhongfei:yhf199012@127.0.0.1:27017/yhf_db");

mongoose.connect("mongodb://yanhongfei:199012@127.0.0.1:27017/datadbbase");
mongoose.connection.on("error", function(err){
    console.log(
        chalk.red('数据库链接失败:' + err)
      );
});
// 连接成功
mongoose.connection.on("open", function(){
    console.log(
        chalk.green('==========数据库链接成功============')
      );
});

// 断开数据库
mongoose.connection.on("disconnected", function(){
    console.log(
        chalk.red('数据库断开')
      );
})
module.exports = mongoose ;
