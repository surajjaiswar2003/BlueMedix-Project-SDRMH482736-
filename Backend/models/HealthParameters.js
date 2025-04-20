const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const healthParametersSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    // Health conditions
    diabetes: {
      type: String,
      enum: ["None", "Type 1", "Type 2"],
      default: "None",
    },
    hypertension: {
      type: String,
      enum: ["Yes", "No"],
      default: "No",
    },
    cardiovascular: {
      type: String,
      enum: ["Present", "Absent"],
      default: "Absent",
    },
    digestiveDisorders: {
      type: String,
      enum: ["None", "IBS", "Celiac"],
      default: "None",
    },
    foodAllergies: {
      type: String,
      enum: ["None", "Dairy", "Nuts", "Shellfish"],
      default: "None",
    },

    // Body metrics
    height: {
      type: Number,
      min: 0,
    },
    weight: {
      type: Number,
      min: 0,
    },
    bmiCategory: {
      type: String,
      enum: ["Underweight", "Normal", "Overweight", "Obese"],
    },
    targetWeight: {
      type: Number,
      min: 0,
    },
    weightChangeHistory: {
      type: String,
      enum: ["Stable", "Fluctuating"],
    },

    // Physical activity
    exerciseFrequency: {
      type: Number,
      min: 0,
      max: 7,
    },
    exerciseDuration: {
      type: Number,
      min: 0,
    },
    exerciseType: {
      type: String,
      enum: ["None", "Cardio", "Strength", "Mixed"],
    },
    dailyStepsCount: {
      type: Number,
      min: 0,
    },
    physicalJobActivityLevel: {
      type: String,
      enum: ["Sedentary", "Moderate", "Active"],
    },

    // Lifestyle
    workSchedule: {
      type: String,
      enum: ["Regular", "Flexible", "Shift"],
    },
    sleepDuration: {
      type: Number,
      min: 0,
    },
    sleepQuality: {
      type: String,
      enum: ["Poor", "Fair", "Good"],
    },
    stressLevel: {
      type: String,
      enum: ["Low", "Medium", "High"],
    },
    mealTimingRegularity: {
      type: String,
      enum: ["Regular", "Irregular"],
    },
    cookingSkills: {
      type: String,
      enum: ["Basic", "Intermediate", "Advanced"],
    },
    availableCookingTime: {
      type: Number,
      min: 0,
    },
    foodBudget: {
      type: String,
      enum: ["Low", "Medium", "High"],
    },
    alcoholConsumption: {
      type: String,
      enum: ["None", "Occasional", "Regular"],
    },
    smokingStatus: {
      type: String,
      enum: ["Non-smoker", "Former", "Smoker"],
    },
    waterIntake: {
      type: Number,
      min: 0,
    },
    eatingOutFrequency: {
      type: Number,
      min: 0,
    },
    snackingBehavior: {
      type: String,
      enum: ["Regular", "Irregular", "Average"],
    },
    foodPreparationTimeAvailability: {
      type: Number,
      min: 0,
    },
    travelFrequency: {
      type: String,
      enum: ["Rarely", "Monthly", "Weekly"],
    },

    // Dietary preferences
    dietType: {
      type: String,
      enum: ["Vegetarian", "Vegan", "Pescatarian", "Non-spicy"],
    },
    mealSizePreference: {
      type: String,
      enum: ["Small frequent", "Regular 3 meals", "Large infrequent"],
    },
    spiceTolerance: {
      type: String,
      enum: ["Low", "Medium", "High"],
    },
    cuisinePreferences: {
      type: String,
      enum: ["Asian", "Western", "Mediterranean", "Other"],
    },
    foodTexturePreferences: {
      type: String,
      enum: ["Soft", "Crunchy", "Mixed"],
    },
    portionControlAbility: {
      type: String,
      enum: ["Poor", "Fair", "Good"],
    },
    previousDietSuccessHistory: {
      type: String,
      enum: ["Yes", "No"],
    },
    foodIntolerances: {
      type: String,
      enum: ["None", "Lactose", "Gluten"],
    },
    preferredMealComplexity: {
      type: String,
      enum: ["Simple", "Moderate", "Complex"],
    },
    seasonalFoodPreferences: {
      type: String,
      enum: ["Yes", "No"],
    },

    // Metadata
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const HealthParameters = mongoose.model(
  "HealthParameters",
  healthParametersSchema
);

module.exports = HealthParameters;
