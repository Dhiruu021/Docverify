const express = require("express");
const router = express.Router();
const Leave = require("../models/Leave");
const { protect, isVerifierAdmin } = require("../middleware/authMiddleware");

// Apply for leave (User)
router.post("/apply", protect, async (req, res) => {
  try {
    const { leaveType, startDate, endDate, reason } = req.body;

    if (!leaveType || !startDate || !endDate || !reason) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const leave = await Leave.create({
      userId: req.user.id,
      userName: req.user.name,
      userEmail: req.user.email,
      leaveType,
      startDate,
      endDate,
      reason,
    });

    res.status(201).json({ message: "Leave applied successfully", leave });
  } catch (error) {
    console.error("Apply leave error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get my leaves (User)
router.get("/my", protect, async (req, res) => {
  try {
    const leaves = await Leave.find({ userId: req.user.id }).sort({ appliedOn: -1 });
    res.json(leaves);
  } catch (error) {
    console.error("Get my leaves error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get all leaves (Admin only)
router.get("/all", protect, isVerifierAdmin, async (req, res) => {
  try {
    const leaves = await Leave.find().sort({ appliedOn: -1 });
    res.json(leaves);
  } catch (error) {
    console.error("Get all leaves error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get pending leaves (Admin only)
router.get("/pending", protect, isVerifierAdmin, async (req, res) => {
  try {
    const leaves = await Leave.find({ status: "pending" }).sort({ appliedOn: -1 });
    res.json(leaves);
  } catch (error) {
    console.error("Get pending leaves error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Approve/Reject leave (Admin only)
router.put("/status/:id", protect, isVerifierAdmin, async (req, res) => {
  try {
    const { status, rejectionReason } = req.body;

    if (!status || !["approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const leave = await Leave.findById(req.params.id);
    if (!leave) {
      return res.status(404).json({ message: "Leave not found" });
    }

    leave.status = status;
    leave.approvedBy = req.user.id;
    leave.approvedOn = new Date();
    if (status === "rejected") {
      leave.rejectionReason = rejectionReason || "";
    }

    await leave.save();
    res.json({ message: `Leave ${status} successfully`, leave });
  } catch (error) {
    console.error("Update leave status error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get leave stats (Admin only)
router.get("/stats", protect, isVerifierAdmin, async (req, res) => {
  try {
    const pending = await Leave.countDocuments({ status: "pending" });
    const approved = await Leave.countDocuments({ status: "approved" });
    const rejected = await Leave.countDocuments({ status: "rejected" });

    res.json({ pending, approved, rejected });
  } catch (error) {
    console.error("Get leave stats error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
