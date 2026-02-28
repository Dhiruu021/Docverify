const Ad = require("../models/Ad");

// Create Ad (Admin)
exports.createAd = async (req, res) => {
  try {
    const { title, link } = req.body;

    console.log("AD CREATE - req.file:", req.file);

    const ad = await Ad.create({
      title,
      link,
      image: req.file?.path || "",
    });

    console.log("AD CREATED:", ad);
    res.json(ad);
  } catch (error) {
    console.error("AD CREATE ERROR:", error);
    res.status(500).json({ error: error.message });
  }
};

// Active Ads (User)
exports.getActiveAds = async (req, res) => {
  try {
    const ads = await Ad.find({ active: true });
    res.json(ads);
  } catch (error) {
    console.error("GET ACTIVE ADS ERROR:", error);
    res.status(500).json({ error: error.message });
  }
};

// All Ads (Admin)
exports.getAllAds = async (req, res) => {
  try {
    const ads = await Ad.find().sort({ createdAt: -1 });
    res.json(ads);
  } catch (error) {
    console.error("GET ALL ADS ERROR:", error);
    res.status(500).json({ error: error.message });
  }
};

// Toggle Ad (Admin)
exports.toggleAd = async (req, res) => {
  const ad = await Ad.findById(req.params.id);
  ad.active = !ad.active;
  await ad.save();
  res.json(ad);
};

// Delete Ad
exports.deleteAd = async (req, res) => {
  await Ad.findByIdAndDelete(req.params.id);
  res.json({ message: "Ad deleted" });
};
