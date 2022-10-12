const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const session = require("express-session");
const mongoose = require("mongoose");
const flash = require("connect-flash");
const MongoStore = require("connect-mongo");

require("dotenv").config();

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const productsRouter = require("./routes/products");
const commentsRouter = require("./routes/comments");

mongoose.connect("mongodb://127.0.0.1/ecom", (err) => {
  console.log(err ? err : "connected to database");
});

const app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      client: mongoose.connection.getClient(),
    }),
  })
);
app.use(flash());

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use((req, res, next) => {
  if (req.session.userId) {
    next();
  } else {
    req.flash("error", "Please login/register to continue");
    return res.redirect("/");
  }
});
app.use("/products", productsRouter);
app.use("/comments", commentsRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
