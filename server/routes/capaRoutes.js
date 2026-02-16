const express = require("express");
const router = express.Router();
const {
  createCAPA,
  getCAPAs,
  updateCAPAStatus,
  startEscalationCheck,
  getDashboardMetrics,
  getNotifications,
} = require("../controllers/capaController");
const { protect, authorize } = require("../middleware/authMiddleware");

router.route("/").post(protect, createCAPA).get(protect, getCAPAs);

router
  .route("/escalate")
  .post(protect, authorize("Admin", "Quality Manager"), startEscalationCheck);

router.route("/metrics").get(protect, getDashboardMetrics);
router.route("/notifications").get(protect, getNotifications);

router
  .route("/:id/status")
  .put(protect, authorize("Quality Manager", "Admin"), updateCAPAStatus);

module.exports = router;
