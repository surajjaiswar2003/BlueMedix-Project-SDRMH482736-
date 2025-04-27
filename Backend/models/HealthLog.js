// models/HealthLog.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Daily log entry schema
const dailyLogSchema = new Schema({
  date: {
    type: Date,
    required: true,
  },
  // Diet tracking
  breakfast: {
    name: String,
    calories: Number,
    protein: Number,
    carbs: Number,
    fat: Number,
  },
  lunch: {
    name: String,
    calories: Number,
    protein: Number,
    carbs: Number,
    fat: Number,
  },
  dinner: {
    name: String,
    calories: Number,
    protein: Number,
    carbs: Number,
    fat: Number,
  },
  afternoonSnack: {
    name: String,
    calories: Number,
    protein: Number,
    carbs: Number,
    fat: Number,
  },
  eveningSnack: {
    name: String,
    calories: Number,
    protein: Number,
    carbs: Number,
    fat: Number,
  },
  // Daily nutrition totals
  dailyNutritionTotals: {
    calories: Number,
    protein: Number,
    carbs: Number,
    fat: Number,
  },
  // Sleep tracking
  sleep: {
    hours: Number,
  },
  // Exercise tracking
  exercise: {
    minutes: Number,
    type: {
      type: String,
      enum: ["cardio", "strength", "mixed", "none"],
    },
  },
  // Water tracking
  water: {
    glasses: Number,
  },
  // Stress tracking
  stress: {
    level: Number, // 1-5 rating
  },
  // Mood tracking
  mood: {
    rating: Number, // 1-5 rating
  },
});

// Main health log schema
const healthLogSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    logs: [dailyLogSchema],
  },
  { timestamps: true }
);

// Create compound index for efficient queries
healthLogSchema.index({ userId: 1, "logs.date": 1 });

const HealthLog = mongoose.model("HealthLog", healthLogSchema);

module.exports = HealthLog;
