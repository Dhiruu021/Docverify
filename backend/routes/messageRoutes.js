const express = require("express");
const router = express.Router();
const Message = require("../models/Message");
const User = require("../models/User");
const { protect } = require("../middleware/authMiddleware");

// Get inbox messages
router.get("/inbox", protect, async (req, res) => {
  try {
    const messages = await Message.find({ receiver: req.user.id })
      .sort({ createdAt: -1 })
      .limit(50);

    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get sent messages
router.get("/sent", protect, async (req, res) => {
  try {
    const messages = await Message.find({ sender: req.user.id })
      .sort({ createdAt: -1 })
      .limit(50);

    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get unread count
router.get("/unread-count", protect, async (req, res) => {
  try {
    const count = await Message.countDocuments({
      receiver: req.user.id,
      read: false,
    });

    res.json({ count });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Send message
router.post("/", protect, async (req, res) => {
  try {
    const { receiverId, subject, content } = req.body;

    const receiver = await User.findById(receiverId);
    if (!receiver) {
      return res.status(404).json({ error: "Receiver not found" });
    }

    const message = await Message.create({
      sender: req.user.id,
      senderName: req.user.name,
      senderRole: req.user.role,
      receiver: receiverId,
      receiverName: receiver.name,
      subject,
      content,
    });

    res.status(201).json(message);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Mark as read
router.put("/:id/read", protect, async (req, res) => {
  try {
    const message = await Message.findByIdAndUpdate(
      req.params.id,
      { read: true, readAt: new Date() },
      { new: true }
    );

    res.json(message);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete message
router.delete("/:id", protect, async (req, res) => {
  try {
    await Message.findByIdAndDelete(req.params.id);
    res.json({ message: "Message deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get users for messaging (teachers can message students, students can message teachers)
router.get("/users", protect, async (req, res) => {
  try {
    let users;
    
    if (req.user.role === "user") {
      // Students can message teachers/admins
      users = await User.find({
        role: { $in: ["verifieradmin", "superadmin"] },
      }).select("name email role");
    } else {
      // Teachers/admins can message all students
      users = await User.find({
        role: "user",
      }).select("name email role");
    }

    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
