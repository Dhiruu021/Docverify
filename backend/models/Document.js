const mongoose = require("mongoose");

const documentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    docType: {
      type: String,
      required: true,
    },

    filePath: {
      type: String,
      required: true,
    },

    cloudinaryUrl: {
      type: String,
    },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },

    reason: {
      type: String,
      required: true,
      minlength: [20, "Reason must be at least 20 words"],
    },
  },
  {
    timestamps: true, 
  }
);

module.exports = mongoose.model("Document", documentSchema);
