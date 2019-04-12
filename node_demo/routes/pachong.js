var express = require("express");
var router = express.Router();
var superagent = require('superagent');
var cheerio = require('cheerio');
var fs = require('fs');

router.get("/", function (req, res, next) {
    superagent.get('http://pic.yesky.com/')
        .end(function (err, sres) {
            if (err) {
                return next(err);
            }
            // http://pic.yesky.com/
            // sres.text 里面存储着网页的 html 内容，将它传给 cheerio.load 之后
            // 就可以得到一个实现了 jquery 接口的变量，我们习惯性地将它命名为 `$`
            // 剩下就都是 jquery 的内容了
            var items = [];
            var $ = cheerio.load(sres.text);
            var $Imgs = $('img');
            $Imgs.each(function (index, element) {
                var $element = $(element);
                items.push({
                    'src': $element.attr('src')
                });
                superagent
                    .get($element.attr('src'))
                    //.set("X-Forwarded-For" , "10.111.198.90")
                    .on('error', function(error){
                        console.log('保存失败');
                    }) 
                    .end(function (err, sres) {
                        if (err) {
                            console.log(err)
                            return;
                        }
                        if (index < 10) { // sres.body 是一个Buffer数据
                            fs.writeFile("./img/" + index + '.jpg', sres.body, 'binary', function (err) {
                                if (err) throw err;
                                console.log('保存成功');
                            });
                        }
                    })
            });
            res.send(items);
        });
});



export default router;