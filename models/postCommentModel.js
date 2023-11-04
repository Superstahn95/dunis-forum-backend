const mongoose = require("mongoose");

//a post comment is going to belong to a post and an author
const postCommentSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: [true, "You cannot send an empty comment"],
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    post: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Post",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("PostComment", postCommentSchema);
