const express = require("express");
const dotenv = require("dotenv");
const cors = require("./middlewares/cors");
const connectDb = require("./config/db");
const globalErrorHandler = require("./controllers/errorController");

process.on("uncaughtException", (err) => {
  process.exit(1);
});

const app = express();
dotenv.config();
const PORT = process.env.PORT || 5500;

//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors);

//middleware routing
app.use("/api/v1/auth", require("./routes/authRoute"));
app.use("/api/v1/post", require("./routes/postRoute"));
app.use("/api/v1/comment", require("./routes/postCommentRoute"));
app.use("/api/v1/forumpost", require("./routes/forumPostRoute"));
app.use("/api/v1/forumpostcomment", require("./routes/forumPostCommentRoute"));
app.use("/api/v1/users", require("./routes/userRoute"));
app.use("/api/v1/newsletter", require("./routes/NewsSubscriberRoute"));
app.use("*", (req, res, next) => {
  res.status(404).json({
    status: "error",
    message: "No route found",
  });
});

//global error handler
app.use(globalErrorHandler);

const server = app.listen(PORT, () => {
  connectDb();
  // console.log(`Server running on port ${PORT}`);
});

process.on("unhandledRejection", (err) => {
  console.log(err);
  server.close(() => {
    process.exit(1);
  });
});
