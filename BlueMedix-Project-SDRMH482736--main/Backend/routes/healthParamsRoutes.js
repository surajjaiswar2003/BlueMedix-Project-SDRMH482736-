// routes/healthParamsRoutes.js
const express = require("express");
const router = express.Router();
const healthParamsController = require("../controllers/healthParamsController");

// Get health parameters for a user
router.get("/:userId", healthParamsController.getHealthParameters);

// Create or update health parameters
router.post("/:userId", healthParamsController.updateHealthParameters);

// Delete health parameters
router.delete("/:userId", healthParamsController.deleteHealthParameters);

module.exports = router;
