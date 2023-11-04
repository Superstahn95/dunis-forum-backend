const express = require("express");
const {
  revokeAuthorization,
  deleteUser,
  getAllUsers,
  permitUser,
  updateUser,
} = require("../controllers/userController");
const { protected, checkUserRole } = require("../controllers/authController");
const multer = require("../middlewares/multer");
const router = express.Router();

//for admin only
router.get(
  "/",
  protected,
  checkUserRole(["admin", "juniorAdmin"]),
  getAllUsers
);

//admin only
router.delete("/:id", protected, checkUserRole(["admin"]), deleteUser);

//admin only
router.patch("/authorize/:id", protected, checkUserRole(["admin"]), permitUser);

//admin only
router.patch(
  "/revoke/:id",
  protected,
  checkUserRole(["admin"]),
  revokeAuthorization
);

//logged in users
router.patch("/update", protected, multer.single("profilePhoto"), updateUser);

module.exports = router;
