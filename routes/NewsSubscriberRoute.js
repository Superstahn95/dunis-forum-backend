const express = require("express");
const {
  createSubscriber,
  deleteSubscriber,
  getAllSubscribers,
} = require("../controllers/NewsSubscriberController");
const { protected, checkUserRole } = require("../controllers/authController");
const router = express.Router();

router.get(
  "/",
  protected,
  checkUserRole(["admin", "juniorAdmin"]),
  getAllSubscribers
);
router.post("/", createSubscriber);
router.delete("/:id", protected, checkUserRole(["admin"]), deleteSubscriber);

module.exports = router;
