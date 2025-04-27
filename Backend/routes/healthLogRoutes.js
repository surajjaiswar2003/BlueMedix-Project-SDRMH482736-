// routes/healthLogRoutes.js
const express = require("express");
const router = express.Router();
const healthLogController = require("../controllers/healthLogController");

// Get logs for a specific date range
router.get("/:userId", healthLogController.getUserLogs);

// Add a new log entry
router.post("/:userId", healthLogController.addLogEntry);

// Update an existing log entry
router.put("/:userId/:date", healthLogController.updateLogEntry);

// Delete a log entry
router.delete("/:userId/:date", healthLogController.deleteLogEntry);

module.exports = router;
