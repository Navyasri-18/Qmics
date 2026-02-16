const ActivityLog = require("../models/ActivityLog");

// @desc    Get all activity logs
// @route   GET /api/logs
// @access  Private (Admin, Quality Manager)
const getLogs = async (req, res) => {
  try {
    const logs = await ActivityLog.find()
      .populate("user", "username")
      .sort({ timestamp: -1 });
    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getLogs };
