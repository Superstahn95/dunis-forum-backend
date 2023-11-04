const mongoose = require("mongoose");

const forumPostSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    forumComments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ForumPostComment",
      },
    ],
    isCodeSnippet: {
      type: Boolean,
      default: false,
    },
    language: {
      type: String,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    content: {
      type: String,
      required: [true, "You cannot submit an empty post"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ForumPost", forumPostSchema);
