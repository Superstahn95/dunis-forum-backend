const User = require("../models/userModel");
const CustomError = require("../utils/customError");
const asyncErrorHandler = require("../utils/asyncErrorHandler");
const cloudinary = require("../utils/cloudinary");

exports.getAllUsers = asyncErrorHandler(async (req, res, next) => {
  //will only return normal users
  const users = await User.find();
  res.status(200).json({
    status: "success",
    users,
  });
});

exports.deleteUser = asyncErrorHandler(async (req, res, next) => {
  const { id } = req.params;
  const user = await User.findById(id);
  if (!user) {
    const err = new CustomError("User not found", 404);
    return next(err);
  }

  await User.findByIdAndDelete(id);
  res.status(200).json({
    status: "success",
    message: `${user.name} has been deleted`,
  });
});

exports.permitUser = asyncErrorHandler(async (req, res, next) => {
  const { id } = req.params;

  const user = await User.findById(id);
  if (!user) {
    const err = new CustomError("User not found", 404);
    return next(err);
  }

  await User.findByIdAndUpdate(
    id,
    { $set: { authorized: true } },
    { new: true }
  );
  res.status(200).json({
    status: "success",
    message: `${user.name} has been granted permission`,
  });
});

exports.updateUser = asyncErrorHandler(async (req, res, next) => {
  //user id should be present in the req.user

  const user = await User.findById(req.user._id);

  const { file } = req;

  if (!user) {
    const err = new CustomError("No user found", 404);
    return next(err);
  }

  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    { $set: req.body },
    { new: true }
  );

  if (file) {
    if (user.profilePhoto) {
      const { public_id: imageId } = user.profilePhoto;
      await cloudinary.uploader.destroy(`Dunis/${imageId}`);
    }
    const { secure_url: url, public_id } = await cloudinary.uploader.upload(
      file.path,
      { folder: "Dunis" }
    );

    updatedUser.profilePhoto = { url, public_id };
  }
  await updatedUser.save();
  res.status(200).json({
    status: "success",
    user: updatedUser,
    message: "Details updated",
  });
});

exports.revokeAuthorization = asyncErrorHandler(async (req, res, next) => {
  const { id } = req.params;
  const user = await User.findById(id);
  if (!user) {
    const err = new CustomError("User not found", 404);
    return next(err);
  }

  await User.findByIdAndUpdate(
    id,
    { $set: { authorized: false } },
    { new: true }
  );

  res.status(200).json({
    status: "success",
    message: `Permission revoked for ${user.name}`,
  });
});
