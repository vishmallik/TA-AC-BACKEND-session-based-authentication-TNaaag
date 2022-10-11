const express = require("express");
const Comment = require("../models/comment");
const router = express.Router();
const Article = require("../models/article");

router.post("/", (req, res, next) => {
  Article.create(req.body, (err, article) => {
    if (err) return next(err);
    return res.redirect("/articles");
  });
});

router.get("/", (req, res, next) => {
  Article.find({}, (err, articles) => {
    if (err) return next(err);
    return res.render("article", { articles });
  });
});

router.get("/:articleId/inc", (req, res, next) => {
  // console.log(req.session.userId);
  if (req.session.userId) {
    let articleId = req.params.articleId;
    Article.findByIdAndUpdate(
      articleId,
      { $inc: { likes: 1 } },
      (err, article) => {
        if (err) return next(err);
        res.redirect("/articles/" + articleId);
      }
    );
  } else {
    req.flash("error", "Please Login");
    return res.redirect("/users/login");
  }
});

router.get("/:articleId/dec", (req, res, next) => {
  if (req.session.userId) {
    let articleId = req.params.articleId;
    Article.findByIdAndUpdate(
      articleId,
      { $inc: { likes: -1 } },
      (err, article) => {
        if (err) return next(err);
        res.redirect("/articles/" + articleId);
      }
    );
  } else {
    req.flash("error", "Please Login");
    return res.redirect("/users/login");
  }
});

router.get("/:articleId/edit", (req, res, next) => {
  if (req.session.userId) {
    let articleId = req.params.articleId;
    Article.findById(articleId, (err, article) => {
      if (err) return next(err);
      res.render("editArticle", { article });
    });
  } else {
    req.flash("error", "Please Login");
    return res.redirect("/users/login");
  }
});

router.get("/:articleId/delete", (req, res, next) => {
  if (req.session.userId) {
    let articleId = req.params.articleId;
    Article.findByIdAndDelete(articleId, (err, deletedArticle) => {
      if (err) return next(err);
      Comment.deleteMany({ articleId: deletedArticle._id }, (err, result) => {
        if (err) return next(err);
        res.redirect("/articles");
      });
    });
  } else {
    req.flash("error", "Please Login");
    return res.redirect("/users/login");
  }
});

router.post("/:articleId/comments", (req, res, next) => {
  if (req.session.userId) {
    let articleId = req.params.articleId;
    req.body.articleId = articleId;
    Comment.create(req.body, (err, comment) => {
      if (err) return next(err);
      Article.findByIdAndUpdate(
        articleId,
        { $push: { comments: comment._id } },
        (err, article) => {
          if (err) return next(err);
          res.redirect("/articles/" + articleId);
        }
      );
    });
  } else {
    req.flash("error", "Please Login");
    return res.redirect("/users/login");
  }
});

router.post("/:articleId", (req, res, next) => {
  if (req.session.userId) {
    let articleId = req.params.articleId;
    Article.findByIdAndUpdate(articleId, req.body, (err, article) => {
      if (err) return next(err);
      res.redirect("/articles/" + articleId);
    });
  } else {
    req.flash("error", "Please Login");
    return res.redirect("/users/login");
  }
});

router.get("/:articleId", (req, res, next) => {
  if (req.session.userId) {
    let articleId = req.params.articleId;
    Article.findById(articleId)
      .populate("comments")
      .exec((err, article) => {
        if (err) return next(err);
        res.render("singleArticle", { article });
      });
  } else {
    req.flash("error", "Please Login");
    return res.redirect("/users/login");
  }
});
module.exports = router;
