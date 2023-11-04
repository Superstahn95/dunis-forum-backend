const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter your name"],
    },
    email: {
      type: String,
      unique: true,
      required: [true, "Please enter your email"],
      // validate: [validator.isEmail, "Enter a valid email address"],
    },
    role: {
      type: String,
      enum: ["user", "juniorAdmin", "admin"],
      default: "user",
    },
    profilePhoto: {
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
    password: {
      type: String,
      required: [true, "Please enter your password"],
    },
    authorized: {
      type: Boolean,
      default: false,
    },
    confirmPassword: {
      type: String,
      validate: {
        validator: function (val) {
          // Check if the password field is being modified
          if (this.isModified("password")) {
            return val === this.password;
          }
          // If password field is not being modified, no validation needed
          return true;
        },
        message: "Password confirmation do not match",
      },
      // Make confirmPassword required only during user creation
      required: function () {
        return this.isNew || this.isModified("password");
      },
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  this.confirmPassword = undefined;
});

userSchema.methods.compareDbPassword = async (password, dbPassword) => {
  return await bcrypt.compare(password, dbPassword);
};

module.exports = new mongoose.model("User", userSchema);
