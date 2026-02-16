const mongoose = require("mongoose");

const documentSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    fileUrl: { type: String, required: true },
    version: { type: String, required: true },
    status: {
      type: String,
      enum: ["Draft", "Under Review", "Approved", "Superseded"],
      default: "Draft",
      index: true,
    },
    assignedReviewer: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    history: [
      {
        action: String,
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        timestamp: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true },
);

// Compound index for efficient lookup and version control
documentSchema.index({ title: 1, version: 1 }, { unique: true });

module.exports = mongoose.model("Document", documentSchema);
