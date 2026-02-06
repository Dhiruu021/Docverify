const express = require("express");
const router = express.Router();

const Document = require("../models/Document");
const { protect, isVerifierAdmin } = require("../middleware/authMiddleware");

// Admin / Verifier dashboard stats
router.get("/stats", protect, isVerifierAdmin, async (req, res) => {
  try {
    const pending = await Document.countDocuments({ status: "pending" });
    const approved = await Document.countDocuments({ status: "approved" });
    const rejected = await Document.countDocuments({ status: "rejected" });

    res.json({
      pending,
      approved,
      rejected,
    });
  } catch (error) {
    console.error("Admin stats error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
