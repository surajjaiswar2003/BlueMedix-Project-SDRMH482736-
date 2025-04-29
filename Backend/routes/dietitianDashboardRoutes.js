// routes/dietitianDashboardRoutes.js
const express = require("express");
const router = express.Router();
const dashboardController = require("../controllers/dietitianDashboardController");

router.get("/stats", dashboardController.getDashboardStats);

module.exports = router;
