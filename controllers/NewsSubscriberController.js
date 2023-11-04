const NewsSubscriber = require("../models/NewsSubscriberModel");
const CustomError = require("../utils/customError");
const asyncErrorHandler = require("../utils/asyncErrorHandler");

exports.createSubscriber = asyncErrorHandler(async (req, res, next) => {
  //a post should have an author
  const subscriber = new NewsSubscriber(req.body);
  await subscriber.save();
  res.status(201).json({
    status: "success",
    message: "Successfully subscribed",
  });
});

exports.deleteSubscriber = asyncErrorHandler(async (req, res, next) => {
  const { id } = req.params;
  const subscriber = await NewsSubscriber.findById(id);
  if (!subscriber) {
    const err = new CustomError("Subscriber not found", 404);
    return next(err);
  }
  await NewsSubscriber.findByIdAndDelete(id);
  res.status(200).json({
    status: "success",
    message: "Email has been removed",
  });
});

exports.getAllSubscribers = asyncErrorHandler(async (req, res, next) => {
  //will only return normal users
  const subscribers = await NewsSubscriber.find().sort({ createdAt: -1 });
  res.status(200).json({
    status: "success",
    subscribers,
  });
});
