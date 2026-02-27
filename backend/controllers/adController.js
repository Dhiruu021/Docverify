const Ad = require("../models/Ad");

// Create Ad (Admin)
exports.createAd = async (req, res) => {
  const { title, link } = req.body;

  const ad = await Ad.create({
    title,
    link,
    image: req.file?.path || "",
  });

  res.json(ad);
};

// Active Ads (User)
exports.getActiveAds = async (req, res) => {
  const ads = await Ad.find({ active: true });
  res.json(ads);
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
