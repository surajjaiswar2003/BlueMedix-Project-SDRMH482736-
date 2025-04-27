// routes/dietPlanRoutes.js
const express = require("express");
const router = express.Router();
const dietPlanController = require("../controllers/dietPlanController");

// Save generated diet plan
router.post("/save/:userId", dietPlanController.saveDietPlan);

// Confirm diet plan for review
router.post("/confirm/:dietPlanId", dietPlanController.confirmForReview);

// Get current diet plan
router.get("/current/:userId", dietPlanController.getCurrentDietPlan);

module.exports = router;
