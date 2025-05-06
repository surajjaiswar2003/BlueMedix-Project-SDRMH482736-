const HealthLog = require("../models/HealthLog");
const User = require("../models/User");

// Get logs for a specific date range
exports.getUserLogs = async (req, res) => {
  try {
    const { userId } = req.params;
    const { startDate, endDate } = req.query;

    // Find user's health log document
    let userLog = await HealthLog.findOne({ userId });

    if (!userLog) {
      return res.status(200).json({ logs: [] });
    }

    // Filter logs by date range if provided
    let filteredLogs = userLog.logs;
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      filteredLogs = userLog.logs.filter((log) => {
        const logDate = new Date(log.date);
        return logDate >= start && logDate <= end;
      });
    }

    // Sort logs by date (newest first)
    filteredLogs.sort((a, b) => new Date(b.date) - new Date(a.date));

    res.status(200).json({ logs: filteredLogs });
  } catch (error) {
    console.error("Error fetching health logs:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Add a new log entry
exports.addLogEntry = async (req, res) => {
  try {
    const { userId } = req.params;
    const logData = req.body;

    // Validate user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Find or create health log document for user
    let userLog = await HealthLog.findOne({ userId });

    if (!userLog) {
      userLog = new HealthLog({
        userId,
        logs: [],
      });
    }

    // Check if log for this date already exists
    const logDate = new Date(logData.date);
    logDate.setHours(0, 0, 0, 0); // Normalize to start of day

    const existingLogIndex = userLog.logs.findIndex((log) => {
      const date = new Date(log.date);
      date.setHours(0, 0, 0, 0);
      return date.getTime() === logDate.getTime();
    });

    // Calculate daily nutrition totals
    const dailyNutritionTotals = {
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
    };

    // Add up nutrition from all meals
    ["breakfast", "lunch", "dinner", "afternoonSnack", "eveningSnack"].forEach(
      (meal) => {
        if (logData[meal]) {
          dailyNutritionTotals.calories += logData[meal].calories || 0;
          dailyNutritionTotals.protein += logData[meal].protein || 0;
          dailyNutritionTotals.carbs += logData[meal].carbs || 0;
          dailyNutritionTotals.fat += logData[meal].fat || 0;
        }
      }
    );

    logData.dailyNutritionTotals = dailyNutritionTotals;

    if (existingLogIndex !== -1) {
      // Update existing log
      userLog.logs[existingLogIndex] = {
        ...userLog.logs[existingLogIndex].toObject(),
        ...logData,
        date: logDate,
      };
    } else {
      // Add new log
      userLog.logs.push({
        ...logData,
        date: logDate,
      });
    }

    await userLog.save();

    res.status(201).json({
      success: true,
      message: "Health log entry added successfully",
      log: userLog.logs[
        existingLogIndex !== -1 ? existingLogIndex : userLog.logs.length - 1
      ],
    });
  } catch (error) {
    console.error("Error adding health log entry:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update an existing log entry
exports.updateLogEntry = async (req, res) => {
  try {
    const { userId, date } = req.params;
    const updateData = req.body;

    const logDate = new Date(date);
    logDate.setHours(0, 0, 0, 0); // Normalize to start of day

    // Find user's health log document
    const userLog = await HealthLog.findOne({ userId });

    if (!userLog) {
      return res.status(404).json({ message: "Health log not found" });
    }

    // Find the specific log entry by date
    const logIndex = userLog.logs.findIndex((log) => {
      const entryDate = new Date(log.date);
      entryDate.setHours(0, 0, 0, 0);
      return entryDate.getTime() === logDate.getTime();
    });

    if (logIndex === -1) {
      return res
        .status(404)
        .json({ message: "Log entry for this date not found" });
    }

    // Calculate daily nutrition totals
    const dailyNutritionTotals = {
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
    };

    // Add up nutrition from all meals
    ["breakfast", "lunch", "dinner", "afternoonSnack", "eveningSnack"].forEach(
      (meal) => {
        if (updateData[meal]) {
          dailyNutritionTotals.calories += updateData[meal].calories || 0;
          dailyNutritionTotals.protein += updateData[meal].protein || 0;
          dailyNutritionTotals.carbs += updateData[meal].carbs || 0;
          dailyNutritionTotals.fat += updateData[meal].fat || 0;
        } else if (userLog.logs[logIndex][meal]) {
          dailyNutritionTotals.calories +=
            userLog.logs[logIndex][meal].calories || 0;
          dailyNutritionTotals.protein +=
            userLog.logs[logIndex][meal].protein || 0;
          dailyNutritionTotals.carbs += userLog.logs[logIndex][meal].carbs || 0;
          dailyNutritionTotals.fat += userLog.logs[logIndex][meal].fat || 0;
        }
      }
    );

    updateData.dailyNutritionTotals = dailyNutritionTotals;

    // Update the log entry
    userLog.logs[logIndex] = {
      ...userLog.logs[logIndex].toObject(),
      ...updateData,
      date: logDate, // Preserve the original date
    };

    await userLog.save();

    res.status(200).json({
      success: true,
      message: "Health log entry updated successfully",
      log: userLog.logs[logIndex],
    });
  } catch (error) {
    console.error("Error updating health log entry:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete a log entry
exports.deleteLogEntry = async (req, res) => {
  try {
    const { userId, date } = req.params;

    const logDate = new Date(date);
    logDate.setHours(0, 0, 0, 0); // Normalize to start of day

    // Find user's health log document
    const userLog = await HealthLog.findOne({ userId });

    if (!userLog) {
      return res.status(404).json({ message: "Health log not found" });
    }

    // Find the specific log entry by date
    const logIndex = userLog.logs.findIndex((log) => {
      const entryDate = new Date(log.date);
      entryDate.setHours(0, 0, 0, 0);
      return entryDate.getTime() === logDate.getTime();
    });

    if (logIndex === -1) {
      return res
        .status(404)
        .json({ message: "Log entry for this date not found" });
    }

    // Remove the log entry
    userLog.logs.splice(logIndex, 1);
    await userLog.save();

    res.status(200).json({
      success: true,
      message: "Health log entry deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting health log entry:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get recent patients by last health log activity
exports.getRecentPatients = async (req, res) => {
  try {
    // Get all users with their latest health log date
    const logs = await HealthLog.aggregate([
      { $unwind: "$logs" },
      {
        $group: {
          _id: "$userId",
          lastLogDate: { $max: "$logs.date" },
        },
      },
      { $sort: { lastLogDate: -1 } },
      { $limit: 10 },
    ]);

    // Populate user info
    const users = await User.find({
      _id: { $in: logs.map((l) => l._id) },
    }).select("firstName lastName email");

    // Merge user info with lastLogDate
    const recentPatients = logs.map((log) => {
      const user = users.find((u) => u._id.equals(log._id));
      return {
        _id: log._id,
        firstName: user?.firstName,
        lastName: user?.lastName,
        email: user?.email,
        lastLogDate: log.lastLogDate,
      };
    });

    // GET /api/health-logs/recent-patients
    exports.getRecentPatients = async (req, res) => {
      try {
        const logs = await HealthLog.aggregate([
          { $unwind: "$logs" },
          {
            $group: {
              _id: "$userId",
              lastLogDate: { $max: "$logs.date" },
            },
          },
          { $sort: { lastLogDate: -1 } },
          { $limit: 10 },
        ]);
        const users = await User.find({
          _id: { $in: logs.map((l) => l._id) },
        }).select("firstName lastName email");
        const recentPatients = logs.map((log) => {
          const user = users.find((u) => u._id.equals(log._id));
          return {
            _id: log._id,
            firstName: user?.firstName,
            lastName: user?.lastName,
            email: user?.email,
            lastLogDate: log.lastLogDate,
          };
        });
        res.json(recentPatients);
      } catch (error) {
        res.status(500).json([]);
      }
    };

    res.json(recentPatients);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
