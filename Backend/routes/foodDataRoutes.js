const express = require('express');
const router = express.Router();
const { getFoodNutritionData } = require('../controllers/foodDataController');

// Get nutrition data for a food item
router.get('/nutrition/:foodName', getFoodNutritionData);

module.exports = router; 