const mongoose = require("mongoose");

const connectDb = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_CONNECTION_STRING);
    console.log(`Connected to database`);
  } catch (error) {
    console.log(error);
  }
};

module.exports = connectDb;
