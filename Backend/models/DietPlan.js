// models/DietPlan.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Meal schema - represents a single meal with recipe reference
const mealSchema = new Schema({
  recipe: {
    type: Schema.Types.ObjectId,
    ref: "Recipe",
  },
  name: {
    type: String,
    required: true,
  },
  calories: Number,
  protein: Number,
  carbs: Number,
  fat: Number,
  sodium: Number,
  fiber: Number,
  ingredients: [String],
  instructions: String,
});

// Daily plan schema - represents a single day in the diet plan
const dailyPlanSchema = new Schema({
  day_number: {
    type: Number,
    required: true,
  },
  day_label: {
    type: String,
    required: true,
  },
  Breakfast: mealSchema,
  Lunch: mealSchema,
  Dinner: mealSchema,
  "Morning Snack": mealSchema,
  "Afternoon Snack": mealSchema,
  Brunch: mealSchema,
});

// Main diet plan schema
const dietPlanSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    days: [dailyPlanSchema],
    plan_totals: {
      calories: Number,
      protein: Number,
      carbs: Number,
      fat: Number,
      sodium: Number,
      fiber: Number,
    },
    macro_percentages: {
      protein_pct: Number,
      carbs_pct: Number,
      fat_pct: Number,
    },
    variety_metrics: {
      unique_recipes: Number,
      total_meals: Number,
      variety_score: Number,
    },
    meal_coverage: Number,
    user_cluster: Number,
    status: {
      type: String,
      enum: ["review", "approved"],
      default: "review",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const DietPlan = mongoose.model("DietPlan", dietPlanSchema);

module.exports = DietPlan;
