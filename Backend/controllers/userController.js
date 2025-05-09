const User = require("../models/User");
const HealthLog = require("../models/HealthLog");

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, "firstName lastName email _id createdAt");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// GET /api/users/count
exports.getUserCount = async (req, res) => {
  try {
    const count = await User.countDocuments();
    res.json({ count });
  } catch (err) {
    res.status(500).json({ count: 0 });
  }
};

// GET /api/users/new-this-month
exports.getNewUsersThisMonth = async (req, res) => {
  try {
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    const count = await User.countDocuments({ createdAt: { $gte: firstDay } });
    res.json({ count });
  } catch (err) {
    res.status(500).json({ count: 0 });
  }
};

// GET /api/users/active-this-week
exports.getActiveUsersThisWeek = async (req, res) => {
  try {
    const now = new Date();
    const firstDayOfWeek = new Date(now);
    firstDayOfWeek.setDate(now.getDate() - now.getDay() + 1); // Monday
    firstDayOfWeek.setHours(0, 0, 0, 0);

    const active = await HealthLog.aggregate([
      { $unwind: "$logs" },
      { $match: { "logs.date": { $gte: firstDayOfWeek } } },
      { $group: { _id: "$userId" } },
      { $count: "count" },
    ]);
    res.json({ count: active[0]?.count || 0 });
  } catch (err) {
    res.status(500).json({ count: 0 });
  }
};

// GET /api/users/growth
exports.getUserGrowth = async (req, res) => {
  try {
    const now = new Date();
    const sixMonthsAgo = new Date(now);
    sixMonthsAgo.setMonth(now.getMonth() - 6);

    const growth = await User.aggregate([
      {
        $match: {
          createdAt: { $gte: sixMonthsAgo }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
            day: { $dayOfMonth: "$createdAt" }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: {
          "_id.year": 1,
          "_id.month": 1,
          "_id.day": 1
        }
      },
      {
        $project: {
          _id: 0,
          date: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: {
                $dateFromParts: {
                  year: "$_id.year",
                  month: "$_id.month",
                  day: "$_id.day"
                }
              }
            }
          },
          count: 1
        }
      }
    ]);

    res.json(growth);
  } catch (err) {
    res.status(500).json([]);
  }
};

// GET /api/users/activity-stats
exports.getUserActivityStats = async (req, res) => {
  try {
    const now = new Date();
    const firstDayOfWeek = new Date(now);
    firstDayOfWeek.setDate(now.getDate() - now.getDay() + 1); // Monday
    firstDayOfWeek.setHours(0, 0, 0, 0);

    // Get total users count
    const totalUsers = await User.countDocuments();

    // Get active users this week
    const activeUsers = await HealthLog.aggregate([
      { $unwind: "$logs" },
      { $match: { "logs.date": { $gte: firstDayOfWeek } } },
      { $group: { _id: "$userId" } },
      { $count: "count" },
    ]);

    const activeCount = activeUsers[0]?.count || 0;
    const inactiveCount = totalUsers - activeCount;

    // Format the response
    const stats = [
      {
        category: "Active Users",
        count: activeCount
      },
      {
        category: "Inactive Users",
        count: inactiveCount
      }
    ];

    res.json(stats);
  } catch (err) {
    res.status(500).json([]);
  }
};
