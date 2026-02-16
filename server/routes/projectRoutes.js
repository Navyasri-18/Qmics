const express = require("express");
const router = express.Router();
const {
  getProjects,
  createProject,
  updateProjectStage,
  getProjectSummary,
} = require("../controllers/projectController");
const { protect, authorize } = require("../middleware/authMiddleware");

router.use(protect);

router.get("/", getProjects);
router.post("/", authorize("Admin", "Director", "CEO"), createProject);
router.put("/:id/stage", updateProjectStage);
router.get("/summary", getProjectSummary);

module.exports = router;
