const DietPlan = require("../models/DietPlan");
const Recipe = require("../models/Recipe");
const User = require("../models/User");

// Helper: populate paths for meals (no spaces)
const populatePaths = [
  { path: "days.Breakfast.recipe", model: "Recipe" },
  { path: "days.Lunch.recipe", model: "Recipe" },
  { path: "days.Dinner.recipe", model: "Recipe" },
  { path: "days.Brunch.recipe", model: "Recipe" },
  { path: "days.MorningSnack.recipe", model: "Recipe" },
  { path: "days.AfternoonSnack.recipe", model: "Recipe" },
];

// --- NEW: Get all diet plans with optional filtering (e.g., by status) ---
exports.getDietPlans = async (req, res) => {
  try {
    const filter = {};
    if (req.query.status) {
      filter.status = req.query.status;
    }
    // You can add more filters here if needed

    const plans = await DietPlan.find(filter).populate(
      "userId",
      "firstName lastName email"
    );
    res.json(plans);
  } catch (error) {
    console.error("Error fetching diet plans:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// --- USER-SIDE ENDPOINTS ---

exports.saveDietPlan = async (req, res) => {
  try {
    const userId = req.params.userId;
    const { dietPlan, nutritionalAnalysis, userCluster } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const days = Object.keys(dietPlan).map((dayLabel, index) => {
      const dayData = dietPlan[dayLabel];
      const dayNumber = index + 1;
      const dayObj = { day_number: dayNumber, day_label: dayLabel };
      for (const [mealType, mealData] of Object.entries(dayData)) {
        if (typeof mealData === "object") {
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

    const filter = { userId: userId };
    const update = {
      days: days,
      plan_totals: nutritionalAnalysis.avg_nutrition,
      macro_percentages: nutritionalAnalysis.macro_percentages,
      variety_metrics: nutritionalAnalysis.variety_metrics,
      meal_coverage: nutritionalAnalysis.meal_coverage,
      user_cluster: userCluster,
      status: "review",
      updatedAt: Date.now(),
    };
    const options = { upsert: true, new: true, setDefaultsOnInsert: true };

    const updatedDietPlan = await DietPlan.findOneAndUpdate(
      filter,
      update,
      options
    );

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

exports.confirmForReview = async (req, res) => {
  try {
    const { dietPlanId } = req.params;
    const userId = req.body.userId || req.query.userId;
    const dietPlan = await DietPlan.findById(dietPlanId);
    if (!dietPlan)
      return res.status(404).json({ message: "Diet plan not found" });
    if (userId && dietPlan.userId.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }
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

exports.getCurrentDietPlan = async (req, res) => {
  try {
    const userId = req.params.userId;
    const dietPlan = await DietPlan.findOne({ userId: userId })
      .sort({ updatedAt: -1 })
      .populate(populatePaths);
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

// --- DIETITIAN ENDPOINTS ---

exports.getPlansForReview = async (req, res) => {
  try {
    const plans = await DietPlan.find({ status: "review" }).populate(
      "userId",
      "firstName lastName email"
    );
    res.json(plans);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.getDietPlanDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const plan = await DietPlan.findById(id)
      .populate("userId", "firstName lastName email")
      .populate(populatePaths);
    if (!plan) return res.status(404).json({ message: "Not found" });
    res.json(plan);
  } catch (error) {
    console.error(
      "DietPlan getDietPlanDetails error:",
      error?.message,
      error?.stack
    );
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateMealInDietPlan = async (req, res) => {
  try {
    const { id } = req.params; // dietPlanId
    const { dayNumber, mealType, recipeId } = req.body;
    const plan = await DietPlan.findById(id);
    if (!plan) return res.status(404).json({ message: "Not found" });
    const day = plan.days.find((d) => d.day_number === dayNumber);
    if (!day) return res.status(404).json({ message: "Day not found" });
    const recipe = await Recipe.findById(recipeId);
    if (!recipe) return res.status(404).json({ message: "Recipe not found" });
    day[mealType] = {
      recipe: recipe._id,
      name: recipe.name,
      calories: recipe.calories,
      protein: recipe.protein,
      carbs: recipe.carbs,
      fat: recipe.fat,
      sodium: recipe.sodium,
      fiber: recipe.fiber,
      ingredients: recipe.ingredients,
      instructions: recipe.instructions,
    };
    await plan.save();
    res.json({ success: true, plan });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.approveDietPlan = async (req, res) => {
  try {
    const { id } = req.params;
    const plan = await DietPlan.findById(id);
    if (!plan) return res.status(404).json({ message: "Not found" });
    plan.status = "approved";
    plan.updatedAt = Date.now();
    await plan.save();
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
