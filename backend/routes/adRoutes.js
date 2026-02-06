const express = require("express");
const router = express.Router();

const upload = require("../middleware/upload");
const {
  protect,
  isSuperAdmin,
} = require("../middleware/authMiddleware");

const {
  createAd,
  getActiveAds,
  toggleAd,
  deleteAd,
} = require("../controllers/adController");

/* ================= USER ================= */
// Get active ads (login required)
router.get("/", protect, getActiveAds);

/* ================= SUPER ADMIN ONLY ================= */

// Create Ad
router.post(
  "/",
  protect,
  isSuperAdmin,
  upload.single("image"),
  createAd
);

// Enable / Disable Ad
router.put(
  "/toggle/:id",
  protect,
  isSuperAdmin,
  toggleAd
);

// Delete Ad
router.delete(
  "/:id",
  protect,
  isSuperAdmin,
  deleteAd
);

module.exports = router;
