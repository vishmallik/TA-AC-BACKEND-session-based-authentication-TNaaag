const express = require("express");
const router = express.Router();
const User = require("../models/user");

router.get("/register", function (req, res, next) {
  let flash = req.flash("error")[0];
  res.render("registrationForm", { flash });
});

router.post("/register", (req, res, next) => {
  User.create(req.body, (err, user) => {
    console.log(err._message);
    if (err._message == "User validation failed") {
      req.flash("error", "Password should be greater than 4 character");
      return res.redirect("/users/register");
    }
    if (err.code == 11000) {
      req.flash("error", "Email is already registered");
      return res.redirect("/users/register");
    }
    if (err) return next(err);
    res.redirect("/users/login");
  });
});

router.get("/login", (req, res, next) => {
  let flash = req.flash("error")[0];
  res.render("login", { flash });
});

router.post("/login", (req, res, next) => {
  let { email, password } = req.body;
  if (!email || !password) {
    req.flash("error", "Email/Password field empty");
    return res.redirect("/users/login");
  }
  User.findOne({ email }, (err, user) => {
    if (err) return next(err);

    //email not present in database
    if (!user) {
      req.flash("error", "User email is not registered");
      return res.redirect("/users/login");
    }
    //comparing password with hashed password
    user.verifyPassword(password, (err, result) => {
      if (err) return next(err);
      if (!result) {
        req.flash("error", "Wrong Password");
        return res.redirect("/users/login");
      }
      //if password is right then add userid to session
      req.session.userId = user.id;
      return res.render("dashboard");
    });
  });
});

router.get("/logout", (req, res, next) => {
  req.session.destroy();
  res.clearCookie("connect.sid");
  return res.redirect("/users/login");
});

module.exports = router;
