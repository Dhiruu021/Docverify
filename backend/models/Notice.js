const mongoose = require("mongoose");

const noticeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: ["general", "academic", "exam", "event", "urgent"],
    default: "general",
  },
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  postedByName: {
    type: String,
    required: true,
  },
  targetAudience: {
    type: String,
    enum: ["all", "students", "teachers", "admins"],
    default: "all",
  },
  pinned: {
    type: Boolean,
    default: false,
  },
  active: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model("Notice", noticeSchema);
