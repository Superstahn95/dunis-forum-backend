const mongoose = require("mongoose");

const subscriberSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      unique: true,
      required: [true, "The email is required"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("NewsSubscriber", subscriberSchema);
