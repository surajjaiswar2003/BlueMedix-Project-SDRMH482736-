const express = require('express');
const router = express.Router();
const { getFoodNutritionData } = require('../controllers/foodDataController');
const csv = require("csv-parser");
const fs = require("fs");
const path = require("path");

// Get nutrition data for a food item
router.get('/nutrition/:foodName', getFoodNutritionData);

// Get food suggestions based on search query
router.get("/suggestions", async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res.status(400).json({ message: "Search query is required" });
    }

    const results = [];
    const csvPath = path.join(__dirname, "../data/food_snack_value.csv");

    // Check if file exists
    if (!fs.existsSync(csvPath)) {
      console.error("CSV file not found:", csvPath);
      return res.status(500).json({ message: "Food data file not found" });
    }

    // Read CSV file and filter results
    fs.createReadStream(csvPath)
      .pipe(csv())
      .on("data", (data) => {
        try {
          // Check if the food name contains the search query (case-insensitive)
          if (data.food_name && data.food_name.toLowerCase().includes(query.toLowerCase())) {
            results.push({
              name: data.food_name,
              calories: parseFloat(data.unit_serving_energy_kcal) || 0,
              protein: parseFloat(data.unit_serving_protein_g) || 0,
              carbs: parseFloat(data.unit_serving_carb_g) || 0,
              fat: parseFloat(data.unit_serving_fat_g) || 0
            });
          }
        } catch (error) {
          console.error("Error processing row:", error);
        }
      })
      .on("end", () => {
        // Sort results by relevance (exact matches first)
        results.sort((a, b) => {
          const aStartsWith = a.name.toLowerCase().startsWith(query.toLowerCase());
          const bStartsWith = b.name.toLowerCase().startsWith(query.toLowerCase());
          if (aStartsWith && !bStartsWith) return -1;
          if (!aStartsWith && bStartsWith) return 1;
          return a.name.localeCompare(b.name);
        });

        // Limit results to 10 items
        res.json(results.slice(0, 10));
      })
      .on("error", (error) => {
        console.error("Error reading CSV file:", error);
        res.status(500).json({ message: "Error reading food data" });
      });
  } catch (error) {
    console.error("Error getting food suggestions:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router; 