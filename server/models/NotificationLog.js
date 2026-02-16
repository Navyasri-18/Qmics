const mongoose = require("mongoose");

const notificationLogSchema = new mongoose.Schema({
  recipient: { type: String }, // User email or ID
  message: { type: String, required: true },
  capaId: { type: mongoose.Schema.Types.ObjectId, ref: "CAPA" },
  type: {
    type: String,
    enum: ["Escalation", "Overdue", "Closed", "System"],
    default: "System",
  },
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model("NotificationLog", notificationLogSchema);
