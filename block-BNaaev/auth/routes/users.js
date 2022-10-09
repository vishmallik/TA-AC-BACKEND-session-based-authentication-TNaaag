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
    res.redirect("/users/register");
  });
});

module.exports = router;
