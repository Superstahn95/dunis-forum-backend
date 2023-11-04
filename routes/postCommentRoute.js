const express = require("express");
const { protected } = require("../controllers/authController");
const {
  createComment,
  deleteComment,
} = require("../controllers/postCommentController");

const router = express.Router();

router.post("/", protected, createComment);
router.delete("/:id", protected, deleteComment);

module.exports = router;

//i am going to have an endpoint to edit a comment
