

import express from 'express';
import User from '../controller/user/user';
const router = express.Router();

router.get("/", function (req, res, next) {
  res.render("login", {
    title: "User===Login"
  });
});

router.post("/", User.login);

export default router;