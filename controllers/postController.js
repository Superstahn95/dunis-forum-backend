const Post = require("../models/postModel");
const CustomError = require("../utils/customError");
const asyncErrorHandler = require("../utils/asyncErrorHandler");
const cloudinary = require("../utils/cloudinary");
const PostComment = require("../models/postCommentModel");

exports.getAllPosts = asyncErrorHandler(async (req, res, next) => {
  const { pageNo, limit, searchTerm } = req.query;

  const searchQuery = { title: { $regex: new RegExp(searchTerm, "i") } }; // Search query for titles
  const posts = await Post.find(searchQuery)
    .sort({ createdAt: -1 })
    .skip(parseInt(pageNo) * parseInt(limit))
    .limit(parseInt(limit))
    .populate({
      path: "comments",
      populate: {
        path: "author",
        model: "User", // The model to populate
        select: "-password",
      },
    });

  const postCount = await Post.countDocuments(searchQuery);
  res.status(200).json({
    status: "success",
    posts,
    postCount,
  });
});

exports.getPost = asyncErrorHandler(async (req, res, next) => {
  const { slug } = req.params;
  const post = await Post.findOne({ slug }).populate({
    path: "comments",
    populate: {
      path: "author",
      model: "User",
      select: "-password",
    },
  });

  if (!post) {
    const err = new CustomError("Post not found", 404);
    return next(err);
  }
  res.status(200).json({
    status: "success",
    post,
  });
});

exports.createPost = asyncErrorHandler(async (req, res, next) => {
  //a post should have an author

  const post = new Post({ ...req.body, author: req.user._id });
  const { file } = req;

  if (file) {
    const { secure_url: url, public_id } = await cloudinary.uploader.upload(
      file.path,
      { folder: "Dunis" }
    );
    post.image = { url, public_id };
  }
  await post.save();
  res.status(201).json({
    status: "success",
    message: "New blog post has been created",
    post,
  });
});

exports.updatePost = asyncErrorHandler(async (req, res, next) => {
  const { id } = req.params;
  const { file } = req;
  const post = await Post.findById(id);
  if (!post) {
    const err = new CustomError("Post not found", 404);
    return next(err);
  }
  let updatedPost = await Post.findByIdAndUpdate(
    id,
    { $set: req.body },
    { new: true }
  );

  if (file) {
    //if a file is present, we want to delete the previous upload from the cloudinary database
    if (post.image) {
      const { public_id: imageId } = post.image;
      await cloudinary.uploader.destroy(`Dunis/${imageId}`);
    }
    const { secure_url: url, public_id } = await cloudinary.uploader.upload(
      file.path,
      { folder: "Dunis" }
    );
    updatedPost = await Post.findByIdAndUpdate(
      id,
      { image: { url, public_id } },
      { new: true }
    );
  }

  res.status(200).json({
    status: "success",
    message: "Post has been updated",
  });
});

exports.deletePost = asyncErrorHandler(async (req, res, next) => {
  const { id } = req.params;
  const post = await Post.findById(id);
  if (!post) {
    const err = new CustomError("No post found", 404);
    return next(err);
  }
  //deleting associated comments
  await PostComment.deleteMany({ _id: { $in: post.comments } });
  if (post.image) {
    const { public_id } = post.image;
    await cloudinary.uploader.destroy(`Dunis/${public_id}`);
  }
  await Post.findByIdAndDelete(id);
  res.status(200).json({
    status: "success",
    message: "Post has been deleted",
  });
});
