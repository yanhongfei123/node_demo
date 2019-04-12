
let request = require("request");
var cheerio = require('cheerio');
import Ids from '../../models/id';
import ArticleModal from '../../models/article';
import BaseComponent from '../user/base';

var pages = [];
var id = 1;

class Article extends BaseComponent{
  constructor() {
    super();
    this.times = 1;
    this.saveArticle = this.saveArticle.bind(this);
    this.downloadImg = this.downloadImg.bind(this);
  }
  downloadImg(pageIndex, responed) {
    var self = this;
    return new Promise((resolve, reject) => {
      request({
        url: 'https://www.cnblogs.com/?CategoryId=808&CategoryType=%22SiteHome%22&ItemListActionName=%22PostList%22&ParentCategoryId=0&PageIndex=' + pageIndex
      }, function (err, res, body) {
        if (err) {
          console.log('=======Error info=======', err, 'Code: ' + res.statusCode);
          reject(res);
          return;
        }
        if (res.statusCode == 200) {
          var $ = cheerio.load(body);
          $('.titlelnk').each((index, item) => {
            pages.push({
              title: $(item).text()
            });
            var title = $(item).text();
            ArticleModal.create({
              title,
              article_id: id++
            });
            
          });
          if (pages.length < 40) {
            self.downloadImg(self.times++, responed);
          } else {
            console.log('===============')       
            resolve(pages);
            responed.send({
              code: 200,
              data: pages,
            });
          }
        }
      });
    });
  }

  async saveArticle(req, res, next) {
    var data = await this.downloadImg(this.times, res);
    console.log('-----------')
    // res.send({
    //   code: 200,
    //   data: data,
    // });

  }
}
export default new Article();