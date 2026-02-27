const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const { protect, isSuperAdmin } = require("../middleware/authMiddleware");
const {
  createAd,
  getActiveAds,
  toggleAd,
  deleteAd,
} = require("../controllers/adController");

router.get("/", protect, getActiveAds);
router.post("/", protect, isSuperAdmin, upload.single("image"), createAd);
router.put("/toggle/:id", protect, isSuperAdmin, toggleAd);
router.delete("/:id", protect, isSuperAdmin, deleteAd);

module.exports = router;
