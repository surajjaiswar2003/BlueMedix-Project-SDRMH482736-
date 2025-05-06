// controllers/recipeController.js
const Recipe = require("../models/Recipe");

// Get all recipes with pagination
exports.getRecipes = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const recipes = await Recipe.find().skip(skip).limit(limit);

    const total = await Recipe.countDocuments();

    res.json({
      recipes,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get recipe by ID
exports.getRecipeById = async (req, res) => {
  try {
    const recipe = await Recipe.findOne({ recipe_id: req.params.id });

    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    res.json(recipe);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Search recipes by various criteria
exports.searchRecipes = async (req, res) => {
  try {
    const {
      query,
      mealType,
      dietType,
      vegetarian,
      vegan,
      gluten_free,
      diabetes_friendly,
      heart_healthy,
      low_sodium,
    } = req.query;

    const searchQuery = {};

    // Text search if query provided
    if (query) {
      searchQuery.$text = { $search: query };
    }

    // Filter by meal type
    if (mealType) {
      searchQuery.meal_type = mealType;
    }

    // Filter by diet type
    if (dietType) {
      searchQuery.diet_type = dietType;
    }

    // Filter by dietary preferences
    if (vegetarian === "true") searchQuery.vegetarian = true;
    if (vegan === "true") searchQuery.vegan = true;
    if (gluten_free === "true") searchQuery.gluten_free = true;
    if (diabetes_friendly === "true") searchQuery.diabetes_friendly = true;
    if (heart_healthy === "true") searchQuery.heart_healthy = true;
    if (low_sodium === "true") searchQuery.low_sodium = true;

    const recipes = await Recipe.find(searchQuery).limit(20);

    res.json(recipes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get recipes by nutritional criteria
exports.getRecipesByNutrition = async (req, res) => {
  try {
    const { minProtein, maxCarbs, maxCalories } = req.query;

    const query = {};

    if (minProtein) query.protein = { $gte: parseInt(minProtein) };
    if (maxCarbs) query.carbs = { $lte: parseInt(maxCarbs) };
    if (maxCalories) query.calories = { $lte: parseInt(maxCalories) };

    const recipes = await Recipe.find(query).limit(20);

    res.json(recipes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get recipes by meal type
exports.getRecipesByMealType = async (req, res) => {
  try {
    const { mealType } = req.params;

    const recipes = await Recipe.find({ meal_type: mealType }).limit(10);

    res.json(recipes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
// Create a new recipe
exports.createRecipe = async (req, res) => {
  try {
    // Ensure recipe_id is unique
    const existing = await Recipe.findOne({ recipe_id: req.body.recipe_id });
    if (existing) {
      return res.status(400).json({ message: "Recipe ID must be unique" });
    }
    const recipe = await Recipe.create(req.body);
    res.status(201).json(recipe);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update recipe by ID
exports.updateRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findOneAndUpdate(
      { recipe_id: req.params.id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }
    res.json(recipe);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete recipe by ID
exports.deleteRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findOneAndDelete({ recipe_id: req.params.id });
    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }
    res.json({ message: "Recipe deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
