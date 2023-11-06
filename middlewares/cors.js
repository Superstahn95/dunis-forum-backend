const cors = require("cors");
const CustomError = require("../utils/customError");
const allowedOrigins = require("../config/allowedOrigins");

const corsOptions = {
  origin: (origin, callback) => {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      const err = new CustomError("Not allowed by CORS");
      callback(err);
    }
  },
  //   origin: "http://localhost:5173",
  optionsSuccessStatus: 200,
};

module.exports = cors(corsOptions);
