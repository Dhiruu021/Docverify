const multer = require("multer");
const { profileStorage } = require("../config/cloudinary");

const uploadProfile = multer({ storage: profileStorage });

module.exports = uploadProfile;
