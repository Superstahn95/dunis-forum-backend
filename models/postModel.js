const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Enter the post title"],
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    body: {
      type: String,
      required: [true, "The post must have a body"],
      // minLength: 100,
    },
    slug: {
      type: String,
      unique: true,
      required: [true, "Enter the post slug"],
    },
    image: {
      type: Object,
      url: {
        type: URL,
        required: true,
      },
      public_id: {
        type: String,
        required: true,
      },
    },
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "PostComment",
      },
    ],
    featuredPost: {
      type: Boolean,
      default: false,
    },
    meta: {
      type: String,
    },
    tags: [String],
  },
  {
    timestamps: true,
  }
);

//deal with post tags field for our post model

module.exports = mongoose.model("Post", postSchema);
