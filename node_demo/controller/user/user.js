'use strict';

var moment = require('moment');
import chalk from 'chalk';
import BaseComponent from './base';
import UserModel from '../../models/user';
import UserInfoModel from '../../models/userInfo';
var eventproxy     = require('eventproxy');
const JwtUtil = require('../../public/utils/jwt');

class User extends BaseComponent {
  constructor() {
    super();
    // 某个方法里面有通过 this 调用 另一个方法的，该方法需要在constructor 里 bind
    this.register = this.register.bind(this);
    this.login = this.login.bind(this);

  }
  populate(req, res, next){
    UserModel.find().populate('articles', 'title').exec((err, doc) => {
      if (err) return res.status(500).json({code:0, message: err.message, err})
      return res.status(200).json({doc});
    }); 
  }
  async login(req, res, next) {
    var ep = new eventproxy();
    ep.on('error', function (msg) {
      res.json({
        status: 0,
        msg,
      });
    });
    var username = req.body.username; //获取post上来的 data数据中 uname的值
    UserModel.findOne({
      username
    }, '-_id -__v').then(async doc => {
      if (!doc) {
        ep.emit('error', '用户名不存在');
      } else if (req.body.password != doc.password) {
        ep.emit('error', '密码错误');
      } else {
        
      //  const cityInfo = await this.guessPosition(req);

        // res.cookie("userId", doc.user_id, {
        //   path: '/',
        //   maxAge: 1000 * 60 * 0.1
        // });
      
        let jwt = new JwtUtil({username});
        let token = jwt.generateToken();

        req.session.user_id = doc.user_id; //将用户信息写入到session
        res.send({
          code: 200,
          token,
          cityInfo,
          user_id: doc.user_id,
          username: doc.username,
          msg: "登录成功"
        });
      }
    }).catch(error => {
      ep.emit('prop_err', error.message)
    });
  }

  async register(req, res, next) {
    let {
      username,
      password
    } = req.body;

    var ep = new eventproxy();
    ep.on('error', function (msg) {
      res.json({
        status: 0,
        msg,
      });
    });

    try {
      let user = await UserModel.findOne({
        username
      });
      if (user) {
        ep.emit('error', '用户名已存在');

        //UserInfoModel.update({user_id: user.user_id}, {'column_desc.game_is_show': 999}).exec();

        //UserInfoModel.update({'column_desc.game_is_show': 999}, {'column_desc.gift_mall_desc': '10086'}).exec();

        // let userInfo =  await UserInfoModel.findOne({user_id: user.user_id});
        // userInfo.column_desc.game_is_show = 0;
        // userInfo.save();

        // UserInfoModel.update({'orderList.productId': 20}, {$set: {"orderList.$.productNum": 888}}, {multi: true}).exec();

       // 修改当前集合里的orderList 数组第一项
       //UserInfoModel.update({user_id: user.user_id}, {$set: {"orderList.0.productNum": 333}}).exec();


       // 删除当前集合里orderList 数组里 productId = 22 的这一项
       //UserInfoModel.update({user_id: user.user_id}, {$pull: {'orderList': {'productId': 21}}}).exec();

      // 删除user_id = 20，这一项里面的orderList数组里 productId <  21 的数据
      // UserInfoModel.update({user_id: 20}, {$pull: {'orderList': {'productId': {$lt: 21}}}}).exec();
        

      //  UserInfoModel.update({user_id: user.user_id}, {$push: {
      //    cartList: { productId: 100, productNum: 500 },
      //    orderList: { productId: 100, productNum: 500 }
      //   }}).exec();

      } else {   
      //await UserInfoModel.update({user_id: 1}, {'column_desc.game_is_show': 999});
        const user_id = await this.getId('user_id');
        const registe_time = moment().format('YYYY-MM-DD HH:mm');
        const newUser = {
          username,
          password,
          user_id,
          registe_time
        };
        const user = await UserModel.create(newUser);
        res.send({
          code: 200,
          data: user,
          msg: '注册成功'
        });
      }
    } catch (error) {
      ep.emit('prop_err', error.message)
    }
  }
}

export default new User();
