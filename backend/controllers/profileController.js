const User = require("../models/User");

// Get Profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update Profile Image
exports.updateProfileImage = async (req, res) => {
  
  try {
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { profileImage: req.file.path },
      { new: true }
    ).select("-password");

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
