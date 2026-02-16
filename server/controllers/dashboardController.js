const CAPA = require("../models/CAPA");
const Document = require("../models/Document");

// @desc    Get dashboard KPI metrics
// @route   GET /api/dashboard/metrics
// @access  Private/Admin/Quality Manager
exports.getMetrics = async (req, res) => {
  try {
    const isEmployee = req.user.role === "Employee";
    const filter = isEmployee ? { assignedTo: req.user._id } : {};
    const docFilter = isEmployee ? { createdBy: req.user._id } : {};

    const totalDocuments = await Document.countDocuments(docFilter);
    const approvedDocuments = await Document.countDocuments({
      ...docFilter,
      status: "Approved",
    });
    const draftDocuments = await Document.countDocuments({
      ...docFilter,
      status: "Draft",
    });

    const capaStats = await CAPA.aggregate([
      { $match: filter },
      {
        $facet: {
          counts: [
            {
              $group: {
                _id: null,
                total: { $sum: 1 },
                open: { $sum: { $cond: [{ $eq: ["$status", "Open"] }, 1, 0] } },
                inProgress: {
                  $sum: { $cond: [{ $eq: ["$status", "In Progress"] }, 1, 0] },
                },
                overdue: {
                  $sum: { $cond: [{ $eq: ["$isOverdue", true] }, 1, 0] },
                },
                escalated: {
                  $sum: { $cond: [{ $eq: ["$status", "Escalated"] }, 1, 0] },
                },
                closed: {
                  $sum: { $cond: [{ $eq: ["$status", "Closed"] }, 1, 0] },
                },
                highRisk: {
                  $sum: { $cond: [{ $gt: ["$riskScore", 15] }, 1, 0] },
                },
              },
            },
          ],
          avgClosureTime: [
            {
              $match: {
                ...filter,
                status: "Closed",
                closedAt: { $exists: true },
                createdAt: { $exists: true },
              },
            },
            {
              $project: {
                closureTime: {
                  $divide: [
                    { $subtract: ["$closedAt", "$createdAt"] },
                    1000 * 60 * 60 * 24, // Convert to days
                  ],
                },
              },
            },
            {
              $group: {
                _id: null,
                avgDays: { $avg: "$closureTime" },
              },
            },
          ],
        },
      },
    ]);

    const stats = capaStats[0].counts[0] || {
      total: 0,
      open: 0,
      inProgress: 0,
      overdue: 0,
      escalated: 0,
      closed: 0,
      highRisk: 0,
    };
    const avgTime = capaStats[0].avgClosureTime[0]?.avgDays || 0;

    res.json({
      totalDocuments,
      approvedDocuments,
      draftDocuments,
      totalCapa: stats.total,
      openCapa: stats.open,
      inProgressCapa: stats.inProgress,
      overdueCapa: stats.overdue,
      escalatedCapa: stats.escalated,
      closedCapa: stats.closed,
      avgTimeToClose: Math.round(avgTime * 10) / 10,
      highRiskCapaCount: stats.highRisk,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get CAPA risk distribution
// @route   GET /api/dashboard/risk-distribution
// @access  Private/Admin/Quality Manager
exports.getRiskDistribution = async (req, res) => {
  try {
    const isEmployee = req.user.role === "Employee";
    const filter = isEmployee ? { assignedTo: req.user._id } : {};

    const distribution = await CAPA.aggregate([
      { $match: filter },
      {
        $project: {
          riskLevel: {
            $switch: {
              branches: [
                { case: { $lte: ["$riskScore", 5] }, then: "Low" },
                { case: { $lte: ["$riskScore", 10] }, then: "Medium" },
                { case: { $lte: ["$riskScore", 15] }, then: "High" },
              ],
              default: "Critical",
            },
          },
        },
      },
      {
        $group: {
          _id: "$riskLevel",
          count: { $sum: 1 },
        },
      },
    ]);

    const result = {
      Low: 0,
      Medium: 0,
      High: 0,
      Critical: 0,
    };

    distribution.forEach((item) => {
      result[item._id] = item.count;
    });

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get CAPA monthly trends
// @route   GET /api/dashboard/monthly-trends
// @access  Private/Admin/Quality Manager
exports.getMonthlyTrends = async (req, res) => {
  try {
    const isEmployee = req.user.role === "Employee";
    const filter = isEmployee ? { assignedTo: req.user._id } : {};

    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const trends = await CAPA.aggregate([
      {
        $facet: {
          created: [
            { $match: { ...filter, createdAt: { $gte: sixMonthsAgo } } },
            {
              $group: {
                _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
                count: { $sum: 1 },
              },
            },
            { $sort: { _id: 1 } },
          ],
          closed: [
            {
              $match: {
                ...filter,
                status: "Closed",
                closedAt: { $gte: sixMonthsAgo },
              },
            },
            {
              $group: {
                _id: { $dateToString: { format: "%Y-%m", date: "$closedAt" } },
                count: { $sum: 1 },
                avgClosureTime: {
                  $avg: {
                    $divide: [
                      { $subtract: ["$closedAt", "$createdAt"] },
                      1000 * 60 * 60 * 24,
                    ],
                  },
                },
              },
            },
            { $sort: { _id: 1 } },
          ],
        },
      },
    ]);

    res.json(trends[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
