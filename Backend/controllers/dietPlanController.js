// controllers/dietPlanController.js
const DietPlan = require("../models/DietPlan");
const Recipe = require("../models/Recipe");
const User = require("../models/User");

// Save generated diet plan
exports.saveDietPlan = async (req, res) => {
  try {
    const userId = req.params.userId;
    const { dietPlan, nutritionalAnalysis, userCluster } = req.body;

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Format the diet plan data to match our schema
    const days = Object.keys(dietPlan).map((dayLabel, index) => {
      const dayData = dietPlan[dayLabel];
      const dayNumber = index + 1;

      // Create day object with all possible meal types
      const dayObj = {
        day_number: dayNumber,
        day_label: dayLabel,
      };

      // Add each meal type that exists in the data
      for (const [mealType, mealData] of Object.entries(dayData)) {
        if (typeof mealData === "object") {
          // Find recipe ID from name
          const recipeId = mealData.recipeId || null;

          dayObj[mealType] = {
            recipe: recipeId,
            name: mealData.name,
            calories: mealData.calories,
            protein: mealData.protein,
            carbs: mealData.carbs,
            fat: mealData.fat,
            sodium: mealData.sodium,
            fiber: mealData.fiber,
            ingredients: mealData.ingredients || [],
            instructions: mealData.instructions || "",
          };
        }
      }

      return dayObj;
    });

    // Define filter, update, and options for findOneAndUpdate
    const filter = { userId: userId };
    const update = {
      days: days,
      plan_totals: nutritionalAnalysis.avg_nutrition,
      macro_percentages: nutritionalAnalysis.macro_percentages,
      variety_metrics: nutritionalAnalysis.variety_metrics,
      meal_coverage: nutritionalAnalysis.meal_coverage,
      user_cluster: userCluster,
      status: "review",
      updatedAt: Date.now()
    };
    const options = { upsert: true, new: true, setDefaultsOnInsert: true };

    // Update existing diet plan or create new one
    const updatedDietPlan = await DietPlan.findOneAndUpdate(filter, update, options);

    res.status(201).json({
      success: true,
      message: "Diet plan saved successfully",
      dietPlanId: updatedDietPlan._id,
    });
  } catch (error) {
    console.error("Error saving diet plan:", error);
    res.status(500).json({ message: "Server error" });
  }
};


// Submit diet plan for review
// Submit diet plan for review
exports.confirmForReview = async (req, res) => {
  try {
    const { dietPlanId } = req.params;
    
    // Get userId from request body or query params instead of req.user
    const userId = req.body.userId || req.query.userId;
    
    // Find the diet plan
    const dietPlan = await DietPlan.findById(dietPlanId);

    if (!dietPlan) {
      return res.status(404).json({ message: "Diet plan not found" });
    }

    // If userId is provided, check if the diet plan belongs to the user
    if (userId && dietPlan.userId.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    // Update the status to review
    dietPlan.status = "review";
    dietPlan.updatedAt = Date.now();

    await dietPlan.save();

    res.json({
      success: true,
      message: "Diet plan submitted for review",
      dietPlan,
    });
  } catch (error) {
    console.error("Error submitting diet plan for review:", error);
    res.status(500).json({ message: "Server error" });
  }
};


// Get user's current diet plan
exports.getCurrentDietPlan = async (req, res) => {
  try {
    const userId = req.params.userId;

    // Find the most recent diet plan
    const dietPlan = await DietPlan.findOne({
      userId: userId,
    })
      .sort({ updatedAt: -1 })
      .populate({
        path: "days.Breakfast.recipe days.Lunch.recipe days.Dinner.recipe days.Brunch.recipe days.Morning Snack.recipe days.Afternoon Snack.recipe",
        model: "Recipe",
      });

    if (!dietPlan) {
      return res.status(404).json({ message: "No diet plan found" });
    }

    res.json({
      success: true,
      dietPlan,
    });
  } catch (error) {
    console.error("Error fetching diet plan:", error);
    res.status(500).json({ message: "Server error" });
  }
};
