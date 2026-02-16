const mongoose = require("mongoose");

const capaHistorySchema = new mongoose.Schema({
  capaId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "CAPA",
    required: true,
  },
  oldStatus: { type: String },
  newStatus: { type: String, required: true },
  changedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model("CapaHistory", capaHistorySchema);
