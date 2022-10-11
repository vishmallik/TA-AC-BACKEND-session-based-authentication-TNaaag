const express = require("express");
const Comment = require("../models/comment");
const router = express.Router();
const Article = require("../models/article");

router.get("/:commentId/like", (req, res, next) => {
  let commentId = req.params.commentId;
  Comment.findByIdAndUpdate(
    commentId,
    { $inc: { likes: 1 } },
    (err, comment) => {
      if (err) return next(err);
      res.redirect("/articles/" + comment.articleId);
    }
  );
});

router.get("/:commentId/dislike", (req, res, next) => {
  let commentId = req.params.commentId;
  Comment.findByIdAndUpdate(
    commentId,
    { $inc: { likes: -1 } },
    (err, comment) => {
      if (err) return next(err);
      res.redirect("/articles/" + comment.articleId);
    }
  );
});

router.get("/:commentId/edit", (req, res, next) => {
  let commentId = req.params.commentId;
  Comment.findById(commentId, (err, comment) => {
    if (err) return next(err);
    res.render("editComment", { comment });
  });
});

router.get("/:commentId/delete", (req, res, next) => {
  let commentId = req.params.commentId;
  Comment.findByIdAndDelete(commentId, (err, deletedComment) => {
    if (err) return next(err);
    Article.findByIdAndUpdate(
      deletedComment.articleId,
      { $pull: { comments: deletedComment._id } },
      (err, article) => {
        if (err) return next(err);
        res.redirect("/articles/" + article.id);
      }
    );
  });
});

router.post("/:commentId", (req, res, next) => {
  let commentId = req.params.commentId;
  Comment.findByIdAndUpdate(commentId, req.body, (err, comment) => {
    if (err) return next(err);
    res.redirect("/articles/" + comment.articleId);
  });
});

module.exports = router;
