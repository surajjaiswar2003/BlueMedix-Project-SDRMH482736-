const express = require("express");
const {
  registerUser,
  loginUser,
  loginDietitian,
  loginAdmin,
  getUserById, // <-- Add this
} = require("../controllers/authController");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/dietitian/login", loginDietitian);
router.post("/admin/login", loginAdmin);

// Get user by ID (for patient logs page)
router.get("/user/:id", getUserById);

module.exports = router;
