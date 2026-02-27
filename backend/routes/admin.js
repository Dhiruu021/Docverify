const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");

const Document = require("../models/Document");
const User = require("../models/User");
const { protect, isVerifierAdmin, isSuperAdmin } = require("../middleware/authMiddleware");

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

// Get all users (Super Admin only)
router.get("/users", protect, isSuperAdmin, async (req, res) => {
  try {
    const users = await User.find({}, "-password").sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    console.error("Get users error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Create new user (Super Admin only)
router.post("/users", protect, isSuperAdmin, async (req, res) => {
  try {
    const { name, email, password, phone, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email and password are required" });
    }

    const userExist = await User.findOne({ email });
    if (userExist) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || "user",
      phone: phone || "",
    });

    res.status(201).json({ message: "User created successfully", userId: user._id });
  } catch (error) {
    console.error("Create user error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Delete user (Super Admin only)
router.delete("/users/:id", protect, isSuperAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role === "superadmin") {
      return res.status(403).json({ message: "Cannot delete superadmin" });
    }

    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Delete user error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
