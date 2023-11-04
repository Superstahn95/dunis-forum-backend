const Post = require("../models/postModel");
const PostComment = require("../models/postCommentModel");
const CustomError = require("../utils/customError");
const asyncErrorHandler = require("../utils/asyncErrorHandler");

//text
//author
//post
exports.createComment = asyncErrorHandler(async (req, res, next) => {
  //author => req.user._id
  const { text, postId } = req.body;
  const postComment = new PostComment({
    text,
    post: postId,
    author: req.user._id,
  });
  const post = await Post.findById(postId);
  if (!post) {
    const err = new CustomError("Post not found", 404);
    return next(err);
  }

  const savedComment = await postComment.save();
  post.comments.push(savedComment._id);
  await post.save();
  res.status(201).json({
    status: "success",
    message: "Comment has been made",
    savedComment: await savedComment.populate("author"), //to be removed because we do not need to return the comment
  });
});

//after deleting comment, i want to take it off the post array
exports.deleteComment = asyncErrorHandler(async (req, res, next) => {
  //in time, i need to make sure the person deleting this is either the owner of the post or the admin
  const { id } = req.params;
  const postComment = await PostComment.findById(id);
  if (!postComment) {
    const err = new CustomError("Comment not found", 404);
    return next(err);
  }
  if (!postComment.author.equals(req.user._id)) {
    const err = new CustomError("Not authorized", 401);
    return next(err);
  }
  const post = await Post.findById(postComment.post);
  if (!post) {
    const err = new CustomError("Post not found", 404);
    return next(err);
  }
  post.comments.pull(id);

  await post.save();
  await PostComment.findByIdAndDelete(id);
  res.status(200).json({
    status: "success",
    message: "Comment has been deleted",
  });
});

//an end point to edit or update a comment
