const Dietician = require("../models/Dietician");

// GET /api/dietitians/count
exports.getDietitianCount = async (req, res) => {
  try {
    const count = await Dietician.countDocuments();
    res.json({ count });
  } catch (err) {
    res.status(500).json({ count: 0 });
  }
};

// GET /api/dietitians
exports.getAllDietitians = async (req, res) => {
  try {
    const dietitians = await Dietician.find(
      {},
      "firstName lastName email _id createdAt"
    );
    res.json(dietitians);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
