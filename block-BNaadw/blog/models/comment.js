const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const commentSchema = new Schema(
  {
    author: String,
    content: { type: String, required: true },
    articleId: { type: Schema.Types.ObjectId, ref: "Article" },
    likes: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Comment", commentSchema);
