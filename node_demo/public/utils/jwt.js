// 引入模块依赖
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');

// 创建 token 类
class Jwt {
  constructor(data) {
    this.data = data;
    this.secretOrPrivateKey = 'todayisfriday';
  }

  //生成token
  generateToken() {
    let token = jwt.sign(this.data, this.secretOrPrivateKey, {
      expiresIn: 60 * 60 * 1// 1小时过期
    });
    return token;
  }

  // 校验token
  verifyToken(success, fail) {
    jwt.verify(this.data, this.secretOrPrivateKey, function (err, decode) {
        if (err) {  //  时间失效的时候/ 伪造的token
          fail();
        } else {
          success(decode);       
        }
    });
  }
}

module.exports = Jwt;
