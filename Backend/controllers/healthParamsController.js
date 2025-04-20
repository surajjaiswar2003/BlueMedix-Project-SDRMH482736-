// controllers/healthParamsController.js
const HealthParameters = require("../models/HealthParameters");
const User = require("../models/User");

// @desc    Get health parameters for a user
// @route   GET /api/health-parameters/:userId
exports.getHealthParameters = async (req, res) => {
  try {
    const healthParams = await HealthParameters.findOne({
      userId: req.params.userId,
    });

    if (!healthParams) {
      return res
        .status(404)
        .json({ message: "Health parameters not found for this user" });
    }

    res.json(healthParams);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Create or update health parameters
// @route   POST /api/health-parameters/:userId
exports.updateHealthParameters = async (req, res) => {
  try {
    // Check if user exists
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update with upsert (create if doesn't exist)
    const healthParams = await HealthParameters.findOneAndUpdate(
      { userId: req.params.userId },
      {
        ...req.body,
        lastUpdated: Date.now(),
      },
      { new: true, upsert: true, runValidators: true }
    );

    res.json(healthParams);
  } catch (error) {
    console.error(error);

    // Handle validation errors
    if (error.name === "ValidationError") {
      const validationErrors = {};
      for (let field in error.errors) {
        validationErrors[field] = error.errors[field].message;
      }
      return res.status(400).json({
        message: "Validation failed",
        errors: validationErrors,
      });
    }

    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Delete health parameters
// @route   DELETE /api/health-parameters/:userId
exports.deleteHealthParameters = async (req, res) => {
  try {
    const healthParams = await HealthParameters.findOneAndDelete({
      userId: req.params.userId,
    });

    if (!healthParams) {
      return res
        .status(404)
        .json({ message: "Health parameters not found for this user" });
    }

    res.json({ message: "Health parameters deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
