require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// Import Routes
const authRoutes = require("./routes/auth");
const medicalHistoryRoutes = require("./routes/medicalHistory"); // Import medical history routes

const app = express();
app.use(express.json());
app.use(cors());

// 🔹 MongoDB Connection Setup
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ Connected to MongoDB Atlas"))
.catch(err => console.error("❌ MongoDB connection error", err));

// Use Routes
app.use("/api/auth", authRoutes);
app.use("/api/medical-history", medicalHistoryRoutes); // Use medical history routes

// 🚀 Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
