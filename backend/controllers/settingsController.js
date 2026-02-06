const Settings = require("../models/Settings");

// GET
const getSettings = async (req, res) => {
  try {
    const settings = await Settings.findOne();
    res.json(settings);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// UPDATE
const updateSettings = async (req, res) => {
  try {
    const settings = await Settings.findOneAndUpdate(
      {},
      req.body,
      { new: true, upsert: true }
    );
    res.json(settings);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getSettings,
  updateSettings,
};
