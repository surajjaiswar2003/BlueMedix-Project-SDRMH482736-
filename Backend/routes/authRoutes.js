const express = require("express");
const {
  registerUser,
  loginUser,
  loginDietitian,
  loginAdmin,
} = require("../controllers/authController");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/dietitian/login", loginDietitian);
router.post("/admin/login", loginAdmin);

module.exports = router;
