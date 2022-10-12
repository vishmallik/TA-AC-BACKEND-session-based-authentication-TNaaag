const express = require("express");
const router = express.Router();
const User = require("../models/user");

router.get("/login", function (req, res, next) {
  if (req.session.userId) {
    return res.redirect("/products");
  } else {
    let msg = req.flash("error");
    return res.render("login", { msg });
  }
});

router.post("/register", (req, res, next) => {
  if (req.session.userId) {
    req.session.destroy();
    res.clearCookie("connect.sid");
  }
  let { email } = req.body;
  if (!email) {
    req.flash("error", "Email/Password cannot be left blank");
    return res.redirect("/");
  }
  User.create(req.body, (err, user) => {
    if (err) {
      if (err.code === 11000) {
        req.flash("error", "User already registered with this email");
        return res.redirect("/");
      }
      if (err.name === "ValidationError") {
        req.flash("error", "Password should be minimum 5 characters long");
        return res.redirect("/");
      }
      return next(err);
    }
    req.flash(
      "success",
      "User successfully registered. Please login to continue"
    );
    return res.redirect("/users/login");
  });
});

router.post("/login", (req, res, next) => {
  let { email, password } = req.body;
  if (!email || !password) {
    req.flash("error", "Email/Password cannot be left blank");
    return res.redirect("/users/login");
  }
  User.findOne({ email }, (err, user) => {
    if (err) return next(err);
    if (!user) {
      req.flash("error", "User email not found. Please Register");
      return res.redirect("/users/login");
    }
    user.verifyPassword(password, (err, result) => {
      if (err) return next(err);
      if (!result) {
        req.flash("error", "Email/Password Combination doesn't match");
        return res.redirect("/users/login");
      }
      req.session.userId = user.id;
      req.session.auth = user.auth;
      console.log(req.session.auth);
      return res.redirect("/products");
    });
  });
});

router.get("/logout", (req, res, next) => {
  req.session.destroy();
  res.clearCookie("connect.sid");
  return res.redirect("/");
});

module.exports = router;
