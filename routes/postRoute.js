const express = require("express");
const {
  createPost,
  deletePost,
  getAllPosts,
  getPost,
  updatePost,
} = require("../controllers/postController");
const { protected, checkUserRole } = require("../controllers/authController");
const multer = require("../middlewares/multer");
const router = express.Router();

//get all posts
router.get("/", getAllPosts);

//create a post
router.post(
  "/",
  protected,
  checkUserRole(["admin", "juniorAdmin"]),
  multer.single("image"),
  createPost
);
// router.post("/", protected, multer.single("image"), (req, res, next) => {
//   res.status(200).json({
//     status: "success",
//     message: "we reached this route",
//     file: req.file,
//   });
// });

//delete a post
router.delete(
  "/:id",
  protected,
  checkUserRole(["admin", "juniorAdmin"]),
  deletePost
);

//get a post
router.get("/:slug", getPost);

//update post
router.patch(
  "/:id",
  protected,
  checkUserRole(["admin", "juniorAdmin"]),
  multer.single("image"),
  updatePost
);

module.exports = router;
