const ForumPost = require("../models/forumPostModel");
const ForumPostComment = require("../models/forumPostCommentModel");
const CustomError = require("../utils/customError");
const asyncErrorHandler = require("../utils/asyncErrorHandler");

//text
//author
//forumPost
// forumComments => for our forum post
exports.createForumComment = asyncErrorHandler(async (req, res, next) => {
  //author => req.user._id
  const { text, forumPostId } = req.body;
  const forumComment = new ForumPostComment({
    text,
    forumPost: forumPostId,
    author: req.user._id,
  });
  const forumPost = await ForumPost.findById(forumPostId);
  if (!forumPost) {
    const err = new CustomError("Post not found", 404);
    return next(err);
  }

  const savedComment = await forumComment.save();
  forumPost.forumComments.push(savedComment._id);
  await forumPost.save();
  res.status(201).json({
    status: "success",
    message: "Comment has been made",
    savedComment: await savedComment.populate("author"),
  });
});

exports.deleteForumComment = asyncErrorHandler(async (req, res, next) => {
  const { id } = req.params;
  const forumComment = await ForumPostComment.findById(id);
  if (!forumComment) {
    const err = new CustomError("Comment not found", 404);
    return next(err);
  }
  const forumPost = await ForumPost.findById(id);
  if (!forumPost) {
    const err = new CustomError("Post not found", 404);
    return next(err);
  }
  forumPost.comments.pull(id);

  await forumPost.save();
  await ForumPostComment.findByIdAndDelete(id);
  res.status(200).json({
    status: "success",
    message: "Comment has been deleted",
  });
});

//one to edit forum comment
