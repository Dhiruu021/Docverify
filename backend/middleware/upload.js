const multer = require("multer");
const { documentStorage } = require("../config/cloudinary");

const upload = multer({ storage: documentStorage });

module.exports = upload;
