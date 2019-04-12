/* GET login page. */

import User from '../controller/user/user';
var express = require("express");
var router = express.Router();

router.get("/", function (req, res, next) {
  res.render("register", {
    title: "User register"
  });
});

router.post("/", User.register);

export default router;