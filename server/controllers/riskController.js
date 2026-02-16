const Risk = require("../models/Risk");
const ActivityLog = require("../models/ActivityLog");

// @desc    Create a Risk
// @route   POST /api/risk
// @access  Private
const createRisk = async (req, res) => {
  try {
    const { description, severity, occurrence, detection } = req.body;

    const risk = await Risk.create({
      description,
      severity,
      occurrence,
      detection,
      createdBy: req.user._id,
    });

    await ActivityLog.create({
      user: req.user._id,
      action: "Created Risk",
      module: "Risk",
      details: `Risk assessment created with RPN ${risk.rpn}`,
    });

    res.status(201).json(risk);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all Risks
// @route   GET /api/risk
// @access  Private
const getRisks = async (req, res) => {
  try {
    const risks = await Risk.find().populate("createdBy", "username");
    res.json(risks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createRisk,
  getRisks,
};
