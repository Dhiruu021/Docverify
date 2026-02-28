const express = require("express");
const router = express.Router();
const multer = require("multer");
const { adStorage } = require("../config/cloudinary");
const { protect, isSuperAdmin } = require("../middleware/authMiddleware");

const uploadAd = multer({ storage: adStorage });
const {
  createAd,
  getActiveAds,
  getAllAds,
  toggleAd,
  deleteAd,
} = require("../controllers/adController");

router.get("/", protect, getActiveAds);
router.get("/all", protect, isSuperAdmin, getAllAds);
router.post("/", protect, isSuperAdmin, uploadAd.single("image"), createAd);
router.put("/toggle/:id", protect, isSuperAdmin, toggleAd);
router.delete("/:id", protect, isSuperAdmin, deleteAd);

module.exports = router;
