var express = require("express");
const User = require("../models/user");
var router = express.Router();

router.get("/register", function (req, res, next) {
  let error = req.flash("error");
  res.render("form", { error });
});

router.post("/register", (req, res, next) => {
  let { email, password } = req.body;
  if (!email || !password) {
    req.flash("error", "email/password cannot be left blank");
    return res.redirect("/users/register");
  }
  User.create(req.body, (err, user) => {
    if (err.code == 11000) {
      req.flash("error", "Email already registered");
      return res.redirect("/users/register");
    }
    if (err.name === "ValidationError") {
      req.flash("error", "Password should be minimum 5 characters long");
      return res.redirect("/users/register");
    }
    if (err) return next(err);
    res.redirect("/users/login");
  });
});

router.get("/login", (req, res, next) => {
  let error = req.flash("error");
  res.render("login", { error });
});

router.post("/login", (req, res, next) => {
  let { email, password } = req.body;
  if (!email || !password) {
    req.flash("error", "email/password cannot be left blank");
    return res.redirect("/users/login");
  }
  User.findOne({ email }, (err, user) => {
    if (!user) {
      req.flash("error", "User not found. Please register first");
      return res.redirect("/users/login");
    }
    user.verifyPassword(password, (err, result) => {
      if (err) return next(err);
      if (!result) {
        req.flash("error", "Entered Password is wrong. Please try again");
        return res.redirect("/users/login");
      }
      req.session.userId = user.id;
      return res.send("Login Successful");
    });
  });
});

module.exports = router;
