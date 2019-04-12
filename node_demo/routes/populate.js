/* GET login page. */

import User from '../controller/user/user';
import BaseComponent from '../controller/user/base'
const baseHandle = new BaseComponent();
console.log(baseHandle)
var express = require("express");
var router = express.Router();


router.get("/populate", User.populate);
router.post("/upload", baseHandle.uploadImg);


export default router;