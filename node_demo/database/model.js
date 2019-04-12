var mongoose = require('./db.js');
var Schema = mongoose.Schema;
//var models = require("./models");

var PersonModel = null;
var PersonSchema = null;

 //创建一个骨架模型，仅仅只是数据库模型在程序片段中的一种结构表现
 PersonSchema = new Schema(models[m]);
 //创建模型，可以用它来操作数据库mydb 中的mydata这个集合，指的是整体
 PersonModel = mongoose.model(m, PersonSchema);
// 在Schema里添加自定义方法 methods => 通过实例调用
PersonSchema.methods.capitalizeName = function () {
    this.name = this.name.toUpperCase();
    return this.name;
};

// statics定义的方法 => 通过 model调用
PersonSchema.statics = {
	findClazzNameByStudentId:function(studentId, callback){
			return this.findOne({_id : studentId}).populate('clazzID')
				.exec(callback)
		}
	//其他方法省略..
 }
//根据模型创建实体，是指的个体对象
var personEntity = new PersonModel({
    name: "yhf",
    password: '123',
    email: "zf@qq.com",
    home: 'beijing'
});

PersonModel.findClazzNameByStudentId();
personEntity.capitalizeName();


// 调用save方法保存前执行的代码
// 我们在model里也定义了created_at等关于时间的属性，这样就知道什么时候doc被创建。
//我们使用Schema的pre方法来保证保存以前可以调用执行一段特定的代码。
// 现在每次save都会执行这段代码，给model的created_at和updated_at设定时间。
//这也是一个hash密码的地方。毕竟直接保存明文密码太不应该了。

PersonSchema.pre('save', function (next) {
    var currentDate = new Date();
    this.updated_at = currentDate;
    this.created_at = currentDate;
    next();
});

//用save 方法把自己保存到数据库中
personEntity.save(function (error, doc) {
    if (error) {
        console.log("error :" + error);
    } else {
        console.log(doc);
    }
});


//向集合中插入10个文档
for (var i = 1; i <= 5; i++) {
    //向数据中保存文档
    PersonModel.create({
        name: 'yhf' + i,
        password: 120 + i,
        age: i
    }, function (err, doc) {
        if (err) console.log(err);
        else console.log(doc); // doci
    });
    //所有的异步方法都是在所有的同步方法执行完毕之后才执行的
    // console.log(i);
}


module.exports = {
    getModel: function (type) {
        return mongoose.model(type);
    }
};