const express = require("express");
const dietitianController = require("../controllers/dietitianController");
const router = express.Router();

router.get("/", dietitianController.getAllDietitians);
router.get("/count", dietitianController.getDietitianCount);

module.exports = router;
