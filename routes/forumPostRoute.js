const express = require("express");
const {
  createForumPost,
  deleteForumPost,
  getAllForumPosts,
  getForumPost,
} = require("../controllers/forumPostController");
const { protected } = require("../controllers/authController");
const router = express.Router();

//deal with the protected middleware
router.get("/", getAllForumPosts);
router.post("/", protected, createForumPost);
router.get("/:id", getForumPost);
router.delete("/:id", protected, deleteForumPost);

module.exports = router;
