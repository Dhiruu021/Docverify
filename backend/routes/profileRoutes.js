const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");
const uploadProfile = require("../middleware/profileUpload");

const {
  getProfile,
  updateProfileImage,
} = require("../controllers/profileController");

router.get("/", protect, getProfile);
router.put("/image", protect, uploadProfile.single("image"), updateProfileImage);

module.exports = router;
