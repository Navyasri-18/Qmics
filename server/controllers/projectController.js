const Project = require("../models/Project");
const Risk = require("../models/Risk");
const ActivityLog = require("../models/ActivityLog");

// @desc    Get all projects
// @route   GET /api/projects
// @access  Private
exports.getProjects = async (req, res) => {
  try {
    const projects = await Project.find().populate(
      "stages.approvedBy",
      "username role",
    );
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new project
// @route   POST /api/projects
// @access  Private/Admin/Director/CEO
exports.createProject = async (req, res) => {
  try {
    const { name, client, description } = req.body;

    const stages = [
      "Requirement",
      "Analysis",
      "Design",
      "Development",
      "Testing",
      "Deployment",
      "Closed",
    ].map((name) => ({
      stageName: name,
      status: name === "Requirement" ? "In Progress" : "Pending",
      startDate: name === "Requirement" ? new Date() : null,
    }));

    const project = await Project.create({
      name,
      client,
      description,
      stages,
      createdBy: req.user._id,
    });

    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update project stage status/progression
// @route   PUT /api/projects/:id/stage
// @access  Private
exports.updateProjectStage = async (req, res) => {
  try {
    const { stageName, status } = req.body;
    const project = await Project.findById(req.params.id);

    if (!project) return res.status(404).json({ message: "Project not found" });

    const stageIndex = project.stages.findIndex(
      (s) => s.stageName === stageName,
    );
    if (stageIndex === -1)
      return res.status(400).json({ message: "Invalid stage" });

    // Progression logic: Cannot move to stage if previous isn't completed
    if (
      stageIndex > 0 &&
      project.stages[stageIndex - 1].status !== "Completed"
    ) {
      return res
        .status(400)
        .json({ message: "Previous stage must be completed first" });
    }

    project.stages[stageIndex].status = status;
    if (status === "Completed") {
      project.stages[stageIndex].endDate = new Date();
      project.stages[stageIndex].approvedBy = req.user._id;

      // Auto move currentStage to next one if available
      if (stageIndex < project.stages.length - 1) {
        project.currentStage = project.stages[stageIndex + 1].stageName;
        project.stages[stageIndex + 1].status = "In Progress";
        project.stages[stageIndex + 1].startDate = new Date();
      } else {
        project.overallStatus = "Completed";
      }

      // Integration: When project reaches Testing
      if (stageName === "Testing") {
        await Risk.create({
          description: `QA Risk Entry for Project: ${project.name}`,
          severity: 7,
          occurrence: 3,
          detection: 5,
          createdBy: req.user._id,
        });
      }

      // Integration: Log governance event for Deployment
      if (stageName === "Deployment") {
        await ActivityLog.create({
          action: "GOVERNANCE_EVENT",
          module: "Project",
          details: `Deployment completed for project ${project.name}`,
          user: req.user._id,
        });
      }
    }

    await project.save();
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get project summary for dashboard
// @route   GET /api/projects/summary
// @access  Private
exports.getProjectSummary = async (req, res) => {
  try {
    const summary = await Project.aggregate([
      {
        $group: {
          _id: "$overallStatus",
          count: { $sum: 1 },
        },
      },
    ]);
    res.json(summary);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
