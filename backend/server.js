const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");

// Routes
const authRoutes = require("./routes/authRoutes");
const documentRoutes = require("./routes/documentRoutes");
const profileRoutes = require("./routes/profileRoutes");   
const settingsRoutes = require("./routes/settingsRoutes");
const adRoutes = require("./routes/adRoutes");

const noticeRoutes = require("./routes/noticeRoutes");
const messageRoutes = require("./routes/messageRoutes");

const app = express();

// middleware
app.use(cors());
app.use(express.json());

// Static uploads folder
app.use("/uploads", express.static("uploads"));
app.use("/api/admin", require("./routes/admin"));

// Routes middleware
app.use("/api/auth", authRoutes);
app.use("/api/docs", documentRoutes);
app.use("/api/profile", profileRoutes);  
app.use("/api/settings", settingsRoutes); 
app.use("/api/ads", adRoutes);

app.use("/api/notices", noticeRoutes);
app.use("/api/messages", messageRoutes);

// DB connect
connectDB();

// test route
app.get("/", (req, res) => {
  res.send("Document Verification Backend Running ");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(` Server running on port ${PORT}`);
});
