const User = require("../models/User");
const DietPlan = require("../models/DietPlan");

exports.getDashboardStats = async (req, res) => {
  try {
    const totalPatients = await User.countDocuments();
    const pendingReviews = await DietPlan.countDocuments({ status: "review" });
    const plansApproved = await DietPlan.countDocuments({ status: "approved" });

    res.json({ totalPatients, pendingReviews, plansApproved });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
