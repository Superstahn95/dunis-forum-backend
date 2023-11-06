const ForumPost = require("../models/forumPostModel");
const CustomError = require("../utils/customError");
const asyncErrorHandler = require("../utils/asyncErrorHandler");
const ForumPostComment = require("../models/forumPostCommentModel");

exports.getAllForumPosts = asyncErrorHandler(async (req, res, next) => {
  const { pageNo, limit } = req.query;

  const forumPosts = await ForumPost.find()
    .sort({ createdAt: -1 })
    .skip(parseInt(pageNo) * parseInt(limit))
    .limit(parseInt(limit))
    .populate({ path: "author", select: "-password" })
    .populate({
      path: "forumComments",
      populate: { path: "author", select: "-password" }, // Populate the 'author' field in 'forumComments'
    });

  const postCount = await ForumPost.countDocuments();
  res.status(200).json({
    status: "success",
    forumPosts,
    postCount,
  });
});

exports.getForumPost = asyncErrorHandler(async (req, res, next) => {
  const { id } = req.params;
  const forumPost = await ForumPost.findById(id)
    .populate({ path: "author", select: "-password" })
    .populate({
      path: "forumComments",
      populate: { path: "author", select: "-password" }, // Populate the 'author' field in 'forumComments'
    });
  if (!forumPost) {
    const err = new CustomError("Post not found", 404);
    return next(err);
  }
  res.status(200).json({
    status: "success",
    forumPost,
  });
});
//author
//isCodeSnippet =>true
//title
//description
//content

exports.createForumPost = asyncErrorHandler(async (req, res, next) => {
  const forumPost = new ForumPost({ ...req.body, author: req.user._id });

  await forumPost.save();
  res.status(201).json({
    status: "success",
    message: "Post has been created",
    forumPost: await forumPost.populate({
      path: "author",
      select: "-password",
    }),
  });
});

// exports.updatePost = asyncErrorHandler(async (req, res, next) => {
//   const { id } = req.params;
//   const { file } = req;
//   const post = await Post.findById(id);
//   if (!post) {
//     const err = new CustomError("Post not found", 404);
//     return next(err);
//   }
//   let updatedPost = await Post.findByIdAndUpdate(
//     id,
//     { $set: req.body },
//     { new: true }
//   );

//   if (file) {
//     //if a file is present, we want to delete the previous upload from the cloudinary database
//     if (post.image) {
//       const { public_id: imageId } = post.image;
//       await cloudinary.uploader.destroy(`Dunis/${imageId}`);
//     }
//     const { secure_url: url, public_id } = await cloudinary.uploader.upload(
//       file.path,
//       { folder: "Dunis" }
//     );
//     updatedPost = await Post.findByIdAndUpdate(
//       id,
//       { image: { url, public_id } },
//       { new: true }
//     );
//   }

//   res.status(200).json({
//     status: "success",
//     message: "Post has been updated",
//   });
// });

exports.deleteForumPost = asyncErrorHandler(async (req, res, next) => {
  const { id } = req.params;

  const forumPost = await ForumPost.findById(id);
  if (!forumPost) {
    const err = new CustomError("No post found", 404);
    return next(err);
  }
  if (req.user.role === "admin" || forumPost.author.equals(req.user._id)) {
    //deleting associated comments
    await ForumPostComment.deleteMany({ _id: { $in: forumPost.comments } });

    await ForumPost.findByIdAndDelete(id);
    res.status(200).json({
      status: "success",
      message: "Post has been deleted",
    });
  } else {
    const err = new CustomError("Not authorized", 401);
    return next(err);
  }
});
