const express = require("express");
const {
  registerUser,
  getAllUsers,
  getUser,
  deleteUser,
  loginUser,
  updateUser,
} = require("../controllers/userController");
const { protect, authorize } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/:id", protect, authorize("admin", "user"), getUser);
router.get("/", protect, authorize("admin", "user"), getAllUsers);
router.put("/:id", protect, authorize("admin", "user"), updateUser);
router.delete("/:id", protect, authorize("admin"), deleteUser);

module.exports = router;
