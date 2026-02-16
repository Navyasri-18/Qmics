const mongoose = require("mongoose");

const stageSchema = new mongoose.Schema({
  stageName: {
    type: String,
    enum: [
      "Requirement",
      "Analysis",
      "Design",
      "Development",
      "Testing",
      "Deployment",
      "Closed",
    ],
    required: true,
  },
  status: {
    type: String,
    enum: ["Pending", "In Progress", "Completed", "Blocked", "Risk Identified"],
    default: "Pending",
  },
  startDate: { type: Date },
  endDate: { type: Date },
  approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

const projectSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    client: { type: String, required: true },
    description: { type: String },
    currentStage: {
      type: String,
      default: "Requirement",
    },
    stages: [stageSchema],
    overallStatus: {
      type: String,
      enum: ["Active", "On Hold", "Completed", "Cancelled"],
      default: "Active",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Project", projectSchema);
