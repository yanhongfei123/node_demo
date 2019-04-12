let fs = require("fs");
let request = require("request");
var cheerio = require('cheerio');
var http = require('http');
class Ut {
  /**
   * 下载网络图片
   * @param {object} opts
   */
  constructor() {
    this.downloadImg = this.downloadImg.bind(this);
    this.times = 1;
    this.totalPage = 50;
    this.pages = [];
  }
  downloadImg(opts = {}) {
    return new Promise((resolve, reject) => {
      request(opts, function (err, res, body) {
        if (err) {
          console.log('=======Error info=======', err, 'Code: ' + res.statusCode);
         // reject(res);
          return;
        }
        if (res.statusCode == 200) {
           var $ = cheerio.load(body);
            $(".home.blog img").each(function (i, v) {
              var src = $(this).attr('src');
              var index = src.lastIndexOf('.');
              request(src).pipe(fs.createWriteStream('./img/' + i + src.substr(index)));
            });
          //resolve(res);
        }
      });
    });
  }
  downloadImg2(PageIndex) {
    var that = this;
    return new Promise((resolve, reject) => {
      request({
        url: 'https://www.cnblogs.com/?CategoryId=808&CategoryType=%22SiteHome%22&ItemListActionName=%22PostList%22&ParentCategoryId=0&PageIndex=' + PageIndex
      }, function (err, res, body) {
        if (err) {
          console.log('=======Error info=======', err, 'Code: ' + res.statusCode);
         // reject(res);
          return;
        }
        if (res.statusCode == 200) {
           var $ = cheerio.load(body);
           $('.titlelnk').each((index, item) =>{
            that.pages.push({
              title: $(item).text()
            });
           });
           if(that.pages.length < 2){
            that.downloadImg2(that.times++);
           } else {
             var json = { data: that.pages };
             fs.unlinkSync('./output.txt');
             fs.appendFile('./output.txt', JSON.stringify(json) ,function(err){

             });           
           }
        }
      });
    });
  }
  
}

export default new Ut();
