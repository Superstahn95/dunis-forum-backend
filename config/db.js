const mongoose = require("mongoose");

const connectDb = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_CONNECTION_STRING);
    console.log(`Connected to database`);
  } catch (error) {
    process.exit(1);
  }
};

module.exports = connectDb;
