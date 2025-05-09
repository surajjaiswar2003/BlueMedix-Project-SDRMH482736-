const express = require("express");
const router = express.Router();
const dietPlanController = require("../controllers/dietPlanController");

// --- USER-SIDE ENDPOINTS ---
router.post("/save/:userId", dietPlanController.saveDietPlan);
router.post("/confirm/:dietPlanId", dietPlanController.confirmForReview);
router.get("/current/:userId", dietPlanController.getCurrentDietPlan);

// --- DIETITIAN ENDPOINTS ---
router.get("/review", dietPlanController.getPlansForReview);
router.get("/", dietPlanController.getDietPlans);
router.get("/count", dietPlanController.getDietPlanCount);
router.get("/stats", dietPlanController.getDietPlanStats);
router.get("/:id", dietPlanController.getDietPlanDetails);
router.put("/:id/meal", dietPlanController.updateMealInDietPlan);
router.put("/:id/approve", dietPlanController.approveDietPlan);

module.exports = router;
