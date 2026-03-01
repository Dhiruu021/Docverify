const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
  },

  phone: {
    type: String,
    required: true,
  },

  password: {
    type: String,
    required: true,
  },

  profileImage: {
    type: String,
    default: "",
  },

  role: {
    type: String,
    enum: ["user", "verifieradmin", "superadmin"],
    default: "user",
  },

  gender: {
    type: String,
    enum: ["male", "female"],
    default: "male",
  },

  resetToken: {
    type: String,
    default: null,
  },

  resetTokenExpiry: {
    type: Date,
    default: null,
  },
});

module.exports = mongoose.model("User", userSchema);
