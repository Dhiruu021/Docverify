const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// REGISTER 

exports.register = async (req, res) => {
  console.log("REGISTER BODY 👉", req.body);
  try {
    const { name, email, password, role, phone } = req.body;

    if (!name || !email || !password || !phone) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const userExist = await User.findOne({ email });
    if (userExist) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || "user",
      phone,
    });

    res.status(201).json({ message: "Registered Successfully" });
  } catch (error) {
    console.error("REGISTER ERROR ", error);
    res.status(500).json({ message: "Server error" });
  }
};

// LOGIN 
exports.login = async (req, res) => {
  console.log("LOGIN BODY:", req.body); // DEBUG LOG

  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // IMPORTANT RESPONSE (frontend ke hisaab se)
    res.json({
      token,
      role: user.role,
      userId: user._id,
      name: user.name,
    });
  } catch (error) {
    console.error("LOGIN ERROR ", error);
    res.status(500).json({ message: "Server error" });
  }
};

//CHANGE PASSWORD
exports.changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    const user = await User.findById(req.user.id);

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Old password is incorrect" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("CHANGE PASSWORD ERROR ", error);
    res.status(500).json({ message: "Server error" });
  }
};
