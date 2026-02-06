const mongoose = require("mongoose");

const auditLogSchema = new mongoose.Schema(
  {
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    action: {
      type: String,
      required: true,
    },
    target: {
      type: String, // document / ad / user
    },
    details: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("AuditLog", auditLogSchema);
