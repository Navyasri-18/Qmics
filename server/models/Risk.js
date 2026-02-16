const mongoose = require("mongoose");

const riskSchema = new mongoose.Schema(
  {
    description: { type: String, required: true },
    severity: { type: Number, min: 1, max: 10, required: true },
    occurrence: { type: Number, min: 1, max: 10, required: true },
    detection: { type: Number, min: 1, max: 10, required: true },
    rpn: { type: Number, default: 0 },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);

riskSchema.pre("save", function () {
  this.rpn = this.severity * this.occurrence * this.detection;
});

module.exports = mongoose.model("Risk", riskSchema);
