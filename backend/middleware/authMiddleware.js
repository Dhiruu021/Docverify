const jwt = require("jsonwebtoken");
const User = require("../models/User");

/*  AUTH CHECK */
const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Not authorized, token missing" });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user; //important
    next();
  } catch (error) {
    console.error("AUTH ERROR ", error.message);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

/*  VERIFIER + ADMIN */
// Roles allowed:
// - verifieradmin
// - superadmin

const isVerifierAdmin = (req, res, next) => {
  if (
    req.user &&
    (req.user.role === "verifieradmin" ||
      req.user.role === "superadmin")
  ) {
    return next();
  }

  return res.status(403).json({
    message: "Verifier/Admin access required",
  });
};

/*  SUPER ADMIN ONLY*/
const isSuperAdmin = (req, res, next) => {
  if (req.user && req.user.role === "superadmin") {
    return next();
  }

  return res.status(403).json({
    message: "Super Admin access required",
  });
};

module.exports = {
  protect,
  isVerifierAdmin,
  isSuperAdmin,
};
