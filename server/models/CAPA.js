const mongoose = require("mongoose");

const capaSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    rootCause: { type: String, required: true },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    dueDate: { type: Date, required: true },
    status: {
      type: String,
      enum: ["Open", "In Progress", "Closed", "Overdue", "Escalated"],
      default: "Open",
    },
    priority: {
      type: String,
      enum: ["Low", "Medium", "High", "Critical"],
      default: "Medium",
    },
    severityLevel: { type: Number, min: 1, max: 5, default: 3 },
    escalationLevel: { type: Number, default: 0 },
    closedAt: { type: Date },
    isOverdue: { type: Boolean, default: false },
    riskScore: { type: Number, default: 0 },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);

// Indexes for performance
capaSchema.index({ dueDate: 1 });
capaSchema.index({ assignedTo: 1 });
capaSchema.index({ riskScore: -1 }); // Sort by highest risk
capaSchema.index({ escalationLevel: -1 });
capaSchema.index({ createdAt: -1 });
capaSchema.index({ status: 1 });

// Auto-calculate Risk Score before saving
capaSchema.pre("save", function () {
  const priorityMap = {
    low: 1,
    medium: 2,
    high: 3,
    critical: 4,
  };

  const priorityKey = (this.priority || "medium").toLowerCase();
  const priorityWeight = priorityMap[priorityKey] || 1;
  const severity = Number(this.severityLevel) || 3;

  this.riskScore = severity * priorityWeight;
});

module.exports = mongoose.model("CAPA", capaSchema);
