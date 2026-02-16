const express = require("express");
const router = express.Router();
const {
  getMetrics,
  getRiskDistribution,
  getMonthlyTrends,
} = require("../controllers/dashboardController");
const { protect, authorize } = require("../middleware/authMiddleware");

router.use(protect);

router.get("/metrics", getMetrics);
router.get("/risk-distribution", getRiskDistribution);
router.get("/monthly-trends", getMonthlyTrends);

module.exports = router;
