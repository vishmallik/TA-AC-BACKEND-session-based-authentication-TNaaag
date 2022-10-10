const express = require("express");
const router = express.Router();
const User = require("../models/user");

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
  let flash = req.flash("error");
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
    if (!email) {
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

module.exports = router;
