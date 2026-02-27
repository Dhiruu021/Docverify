const express = require("express");
const router = express.Router();

const auth = require("../middleware/authMiddleware");
const settingsController = require("../controllers/settingsController");

// DEBUG (temporary – dekhne ke liye)
console.log("protect:", typeof auth.protect);
console.log("isSuperAdmin:", typeof auth.isSuperAdmin);
console.log("getSettings:", typeof settingsController.getSettings);
console.log("updateSettings:", typeof settingsController.updateSettings);

// Get settings (Super Admin)
router.get(
  "/",
  auth.protect,
  auth.isSuperAdmin,
  settingsController.getSettings
);

// Update settings (Super Admin)
router.put(
  "/",
  auth.protect,
  auth.isSuperAdmin,
  settingsController.updateSettings
);

module.exports = router;
