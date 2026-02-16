const CAPA = require("../models/CAPA");
const ActivityLog = require("../models/ActivityLog");
const CapaHistory = require("../models/CapaHistory");
const NotificationLog = require("../models/NotificationLog");
const { runCapaScheduler } = require("../services/capaScheduler");

// @desc    Create a CAPA
// @route   POST /api/capa
// @access  Private
const createCAPA = async (req, res) => {
  try {
    console.log("Creating CAPA with data:", req.body);
    const {
      title,
      description,
      rootCause,
      assignedTo,
      dueDate,
      priority,
      severityLevel,
    } = req.body;

    const capaData = {
      title,
      description,
      rootCause,
      dueDate,
      priority,
      severityLevel: Number(severityLevel) || 3,
      createdBy: req.user?._id,
    };

    if (!req.user) {
      return res
        .status(401)
        .json({ message: "User context missing (Auth Error)" });
    }

    // Only add assignedTo if it's a valid ObjectId
    if (assignedTo && assignedTo.match(/^[0-9a-fA-F]{24}$/)) {
      capaData.assignedTo = assignedTo;
    }

    const capa = await CAPA.create(capaData);

    await ActivityLog.create({
      user: req.user._id,
      action: "Created CAPA",
      module: "CAPA",
      details: `CAPA ${title} created (Priority: ${priority})`,
    });

    res.status(201).json(capa);
  } catch (error) {
    console.error("CAPA Controller Error:", error);
    res.status(500).json({ message: error.message || "Internal Server Error" });
  }
};

// @desc    Get all CAPAs
// @route   GET /api/capa
// @access  Private
const getCAPAs = async (req, res) => {
  try {
    const capas = await CAPA.find()
      .populate("assignedTo", "username")
      .populate("createdBy", "username")
      .sort({ createdAt: -1 }); // Newest first
    res.json(capas);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update CAPA status
// @route   PUT /api/capa/:id/status
// @access  Private (Quality Manager, Admin)
const updateCAPAStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const capa = await CAPA.findById(req.params.id);

    if (capa) {
      const oldStatus = capa.status;

      if (status === "Closed") {
        capa.closedAt = new Date();
        capa.isOverdue = false; // Reset overdue if closed
      }

      capa.status = status;
      await capa.save();

      // Track History
      await CapaHistory.create({
        capaId: capa._id,
        oldStatus,
        newStatus: status,
        changedBy: req.user._id,
      });

      await ActivityLog.create({
        user: req.user._id,
        action: "Updated CAPA Status",
        module: "CAPA",
        details: `CAPA ${capa.title} status updated from ${oldStatus} to ${status}`,
      });

      res.json(capa);
    } else {
      res.status(404).json({ message: "CAPA not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Manually trigger escalation check
// @route   POST /api/capa/escalate
// @access  Private (Admin, Quality Manager)
const startEscalationCheck = async (req, res) => {
  try {
    await runCapaScheduler();
    res.json({ message: "Escalation check completed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get Dashboard Metrics
// @route   GET /api/capa/metrics
// @access  Private
const getDashboardMetrics = async (req, res) => {
  try {
    const totalCapa = await CAPA.countDocuments();
    const openCapa = await CAPA.countDocuments({ status: "Open" });
    const inProgressCapa = await CAPA.countDocuments({ status: "In Progress" });
    const overdueCapa = await CAPA.countDocuments({ status: "Overdue" });
    const escalatedCapa = await CAPA.countDocuments({ status: "Escalated" });
    const criticalCapaCount = await CAPA.countDocuments({
      priority: "Critical",
    });

    // Calculate Average Time to Close
    const closedCapas = await CAPA.find({
      status: "Closed",
      closedAt: { $exists: true },
    });
    let avgTimeToClose = 0;
    if (closedCapas.length > 0) {
      const totalDays = closedCapas.reduce((acc, curr) => {
        const days =
          (new Date(curr.closedAt) - new Date(curr.createdAt)) /
          (1000 * 60 * 60 * 24);
        return acc + days;
      }, 0);
      avgTimeToClose = (totalDays / closedCapas.length).toFixed(1);
    }

    res.json({
      totalCapa,
      openCapa,
      inProgressCapa,
      overdueCapa,
      escalatedCapa,
      criticalCapaCount,
      avgTimeToClose,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get Notifications
// @route   GET /api/capa/notifications
// @access  Private
const getNotifications = async (req, res) => {
  try {
    const notifications = await NotificationLog.find()
      .sort({ timestamp: -1 })
      .limit(20);
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createCAPA,
  getCAPAs,
  updateCAPAStatus,
  startEscalationCheck,
  getDashboardMetrics,
  getNotifications,
};
