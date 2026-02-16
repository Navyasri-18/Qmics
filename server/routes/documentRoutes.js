const express = require("express");
const router = express.Router();
const {
  uploadDocument,
  getDocuments,
  updateStatus,
} = require("../controllers/documentController");
const { protect, authorize } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

router
  .route("/")
  .post(protect, upload.single("file"), uploadDocument)
  .get(protect, getDocuments);

router
  .route("/:id/status")
  .put(protect, authorize("Quality Manager", "Admin"), updateStatus);

module.exports = router;
