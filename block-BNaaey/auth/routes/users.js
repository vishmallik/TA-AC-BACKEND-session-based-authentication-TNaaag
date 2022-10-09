var express = require("express");
const User = require("../models/user");
var router = express.Router();

/* GET users listing. */
router.get("/register", function (req, res, next) {
  res.render("registrationForm");
});

router.post("/register", (req, res, next) => {
  User.create(req.body, (err, user) => {
    if (err) return next(err);
    res.redirect("/users/login");
  });
});

router.get("/login", (req, res, next) => {
  res.render("login");
});

router.post("/login", (req, res, next) => {
  let { email, password } = req.body;
  //check if email and passwords fields submitted are not empty
  if (!email || !password) {
    return res.redirect("/users/login");
  }
  User.findOne({ email }, (err, user) => {
    //handling server errors
    if (err) return next(err);

    //if user not present with specified email in db
    if (!user) {
      return res.redirect("/users/login");
    }
    //if email present then check for password using schema methods
    user.verifyPassword(password, (err, result) => {
      if (err) return next(err);
      //password dont match
      if (!result) {
        return res.redirect("/user/login");
      }
      //password matches and add userId to session
      req.session.userId = user._id;
      return res.render("dashboard");
    });
  });
});
module.exports = router;
