const express = require("express");
const {
  loginUser,
  reAuthenticate,
  registerUser,
  protected,
  changeUserPassword,
} = require("../controllers/authController");
const router = express.Router();

router.post("/reauthenticate", reAuthenticate);
router.post("/login", loginUser);
router.post("/register", registerUser);
router.patch("/change-password", protected, changeUserPassword);
router.get("/test", protected);

module.exports = router;
