// models/Recipe.js
const mongoose = require("mongoose");

const recipeSchema = new mongoose.Schema({
  recipe_id: {
    type: Number,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  meal_type: String,
  protein: Number,
  carbs: Number,
  fat: Number,
  calories: Number,
  sodium: Number,
  fiber: Number,
  ingredients: [String],
  instructions: String,
  vegetarian: Boolean,
  vegan: Boolean,
  gluten_free: Boolean,
  diabetes_friendly: Boolean,
  heart_healthy: Boolean,
  low_sodium: Boolean,
  diet_type: String,
  cooking_difficulty: String,
  prep_time: Number,
});

// Add text index for searching recipes by name or ingredients
recipeSchema.index({ name: "text", ingredients: "text" });

const Recipe = mongoose.model("Recipe", recipeSchema);

module.exports = Recipe;
