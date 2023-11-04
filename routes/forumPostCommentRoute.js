const express = require("express");
const {
  createForumComment,
  deleteForumComment,
} = require("../controllers/forumPostCommentController");
const { protected } = require("../controllers/authController");
const router = express.Router();

router.post("/", protected, createForumComment);
router.delete("/:id", protected, deleteForumComment);

module.exports = router;
