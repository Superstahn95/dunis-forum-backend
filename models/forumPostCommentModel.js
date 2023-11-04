const mongoose = require("mongoose");

const forumPostCommentSchema = new mongoose.Schema(
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
    forumPost: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "ForumPost",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ForumPostComment", forumPostCommentSchema);
