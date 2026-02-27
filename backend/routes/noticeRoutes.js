const express = require("express");
const router = express.Router();
const Notice = require("../models/Notice");
const { protect, isVerifierAdmin } = require("../middleware/authMiddleware");

// Get all notices (for users)
router.get("/", protect, async (req, res) => {
  try {
    const userRole = req.user.role;
    let targetFilter = {};
    
    if (userRole === "user") {
      targetFilter = { targetAudience: { $in: ["all", "students"] } };
    } else if (userRole === "verifieradmin") {
      targetFilter = { targetAudience: { $in: ["all", "teachers"] } };
    }

    const notices = await Notice.find({ 
      active: true,
      ...targetFilter
    })
      .sort({ pinned: -1, createdAt: -1 })
      .limit(50);

    res.json(notices);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create notice (admin only)
router.post("/", protect, isVerifierAdmin, async (req, res) => {
  try {
    const { title, content, category, targetAudience } = req.body;
    
    const notice = await Notice.create({
      title,
      content,
      category,
      targetAudience,
      postedBy: req.user.id,
      postedByName: req.user.name,
    });

    res.status(201).json(notice);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update notice (admin only)
router.put("/:id", protect, isVerifierAdmin, async (req, res) => {
  try {
    const { title, content, category, targetAudience, pinned, active } = req.body;
    
    const notice = await Notice.findByIdAndUpdate(
      req.params.id,
      { title, content, category, targetAudience, pinned, active },
      { new: true }
    );

    res.json(notice);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete notice (admin only)
router.delete("/:id", protect, isVerifierAdmin, async (req, res) => {
  try {
    await Notice.findByIdAndDelete(req.params.id);
    res.json({ message: "Notice deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
