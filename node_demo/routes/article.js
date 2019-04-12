
import Article from '../controller/article/article';
var express = require("express");
var router = express.Router();


router.get("/", Article.saveArticle);

export default router;