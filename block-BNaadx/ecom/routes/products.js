const express = require("express");
const Comment = require("../models/comment");
const router = express.Router();
const Product = require("../models/product");

router.get("/", (req, res, next) => {
  Product.find({}, (err, products) => {
    if (err) return next(err);
    if (req.session.auth === "admin") {
      return res.render("products", { products, cart: false, admin: true });
    } else {
      return res.render("products", { products, cart: false, admin: false });
    }
  });
});

router.get("/new", (req, res, next) => {
  if (req.session.auth === "admin") {
    return res.render("addProduct");
  } else {
    return res.redirect("/products");
  }
});

router.post("/", (req, res, next) => {
  Product.create(req.body, (err, product) => {
    if (err) return next(err);
    res.redirect("/products");
  });
});

router.get("/:productId/edit", (req, res, next) => {
  let productId = req.params.productId;
  Product.findById(productId, (err, product) => {
    if (err) return next(err);
    res.render("editProduct", { product });
  });
});

router.get("/:productId/delete", (req, res, next) => {
  let productId = req.params.productId;
  Product.findByIdAndDelete(productId, (err, product) => {
    if (err) return next(err);
    Comment.deleteMany({ productId }, (err, comments) => {
      if (err) return next(err);
      res.redirect("/products");
    });
  });
});

router.get("/cart", (req, res, next) => {
  Product.find({ isInCart: true }, (err, products) => {
    if (err) return next(err);
    res.render("cart", { products, cart: true });
  });
});

router.post("/:productId/comments", (req, res, next) => {
  let productId = req.params.productId;
  req.body.productId = productId;
  Comment.create(req.body, (err, comment) => {
    if (err) return next(err);
    Product.findByIdAndUpdate(
      productId,
      { $push: { comments: comment.id } },
      (err, product) => {
        if (err) return nect(err);
        res.redirect("/products/" + product.id);
      }
    );
  });
});
router.get("/:productId/like", (req, res, next) => {
  let productId = req.params.productId;
  Product.findByIdAndUpdate(
    productId,
    { $inc: { likes: 1 } },
    (err, product) => {
      if (err) return nect(err);
      res.redirect("/products/" + productId);
    }
  );
});

router.get("/:productId/dislike", (req, res, next) => {
  let productId = req.params.productId;
  Product.findByIdAndUpdate(
    productId,
    { $inc: { likes: -1 } },
    (err, product) => {
      if (err) return nect(err);
      res.redirect("/products/" + productId);
    }
  );
});

router.get("/:productId/cart", (req, res, next) => {
  let productId = req.params.productId;
  Product.findByIdAndUpdate(productId, { isInCart: true }, (err, product) => {
    if (err) return nect(err);
    req.flash("success", "Added to Cart. Please check cart to checkout");
    res.redirect("/products/" + productId);
  });
});
router.get("/:productId/buy", (req, res, next) => {
  let productId = req.params.productId;
  Product.findById(productId, (err, product) => {
    if (err) return nect(err);
    res.render("buy", { product });
  });
});

router.get("/:productId", (req, res, next) => {
  let productId = req.params.productId;
  Product.findById(productId)
    .populate("comments")
    .exec((err, product) => {
      if (err) return next(err);
      let msg = req.flash("success");
      if (req.session.auth === "admin") {
        return res.render("singleProduct", { product, msg, admin: true });
      } else {
        return res.render("singleProduct", { product, msg, admin: false });
      }
    });
});

router.post("/:productId", (req, res, next) => {
  let productId = req.params.productId;
  Product.findByIdAndUpdate(productId, req.body, (err, product) => {
    if (err) return next(err);
    res.redirect("/products/" + productId);
  });
});

module.exports = router;
