const asyncErrorHandler = require("../utils/asyncErrorHandler");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const CustomError = require("../utils/customError");
const bcrypt = require("bcryptjs");

exports.registerUser = asyncErrorHandler(async (req, res, next) => {
  //create a user

  const user = new User(req.body);
  await user.save();
  const token = generateToken(user._id);
  const { password, ...userWithoutPassword } = user.toObject();
  res.status(200).json({
    status: "success",
    message: "user created",
    user: userWithoutPassword,
    token,
  });
});

exports.loginUser = asyncErrorHandler(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    //check on the right status codes later
    const err = new CustomError("Fill all fields", 400);
    return next(err);
  }
  //check if a user with that mail exists
  const user = await User.findOne({ email });
  if (!user) {
    const err = new CustomError("Invalid credentials", 401);
    return next(err);
  }

  const isPasswordMatch = await user.compareDbPassword(password, user.password);

  if (!isPasswordMatch) {
    const err = new CustomError("Invalid credentials", 401);
    return next(err);
  }
  const token = generateToken(user._id);
  const userWithoutPassword = user.toObject();
  delete userWithoutPassword.password;

  res.status(200).json({
    status: "success",
    user: userWithoutPassword,
    token,
  });
});

exports.reAuthenticate = asyncErrorHandler(async (req, res, next) => {
  const { token } = req.body;
  if (!token) {
    const err = new CustomError("No token!! Not authenticated", 401);
    return next(err);
  }

  //verify or decode token
  // const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
  // const user = await User.findById(decodedToken.id);
  // if (!user) {
  //   const err = new CustomError("User not found", 404);
  //   return next(err);
  // }

  // res.status(200).json({
  //   status: "success",
  //   user,
  // });
  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) {
      if (err.name === "TokenExpiredError") {
        const err = new CustomError("Session expired", 401);
        return next(err);
      } else {
        const err = new CustomError("Token is invalid", 403);
        return next(err);
      }
    }
    const user = await User.findById(decoded.id);
    if (!user) {
      const err = new CustomError("User not found", 404);
      return next(err);
    }
    const { password, ...userWithoutPassword } = user.toObject();
    res.status(200).json({
      status: "success",
      user: userWithoutPassword,
    });
  });
});

exports.protected = asyncErrorHandler(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    const err = new CustomError("Log in or sign up", 401);
    return next(err);
  }

  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) {
      if (err.name === "TokenExpiredError") {
        const err = new CustomError("Session expired", 401);
        return next(err);
      } else {
        const err = new CustomError("Token is invalid", 403);
        return next(err);
      }
    }
    const user = await User.findById(decoded.id);
    if (!user) {
      const err = new CustomError("User not found", 404);
      return next(err);
    }
    req.user = user;
    next();
  });
  // console.log(req.user);

  // const user = await User.findById(decodedToken.id);

  // req.user = user;

  //   res.status(200).json({
  //     status: "success",
  //     user: req.user,
  //   });
});

exports.changeUserPassword = asyncErrorHandler(async (req, res, next) => {
  //get the user from req.user
  const user = await User.findById(req.user._id);
  //old password and new password should be part of the req.body
  const { oldPassword, newPassword, confirmPassword } = req.body;
  const isPasswordMatch = await req.user.compareDbPassword(
    oldPassword,
    user.password
  );
  if (!isPasswordMatch) {
    const err = new CustomError("Incorrect password", 401);
    return next(err);
  }
  if (newPassword !== confirmPassword) {
    const err = new CustomError("Passwords do not match", 401);
    return next(err);
  }

  user.password = newPassword;
  user.confirmPassword = newPassword;

  await user.save();
  res.status(200).json({
    status: "sucess",
    message: "Password has been changed",
  });
});

exports.checkUserRole = (roles) => {
  //if i want to grant permission to different roles, i can modify the parameter to "...role".
  //and then i can say if role.includes(req.user.role || userRole)
  return (req, res, next) => {
    const userRole = req.user.role;
    if (!roles.includes(userRole)) {
      const err = new CustomError("Not authorized", 403);
      return next(err);
    } else {
      next();
    }
  };
};

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "3d" });
};
