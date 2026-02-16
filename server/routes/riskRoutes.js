const express = require("express");
const router = express.Router();
const { createRisk, getRisks } = require("../controllers/riskController");
const { protect } = require("../middleware/authMiddleware");

router.route("/").post(protect, createRisk).get(protect, getRisks);

module.exports = router;
