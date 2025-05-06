// routes/recipeRoutes.js
const express = require("express");
const router = express.Router();
const recipeController = require("../controllers/recipeController");

// Get all recipes with pagination
router.get("/", recipeController.getRecipes);

// Search recipes
router.get("/search", recipeController.searchRecipes);

// Get recipes by nutritional criteria
router.get("/nutrition", recipeController.getRecipesByNutrition);

// Get recipes by meal type
router.get("/meal/:mealType", recipeController.getRecipesByMealType);

// Get recipe by ID
router.get("/:id", recipeController.getRecipeById);

// Create a new recipe
router.post("/", recipeController.createRecipe);

// Update a recipe by ID
router.put("/:id", recipeController.updateRecipe);

// Delete a recipe by ID
router.delete("/:id", recipeController.deleteRecipe);
module.exports = router;
