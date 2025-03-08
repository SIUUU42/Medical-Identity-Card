require('dotenv').config({ path: './.env' });
console.log("Environment variables loaded:", process.env);

const path = require('path');
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// Import Routes
const authRoutes = require("./routes/auth");
const medicalHistoryRoutes = require("./routes/medicalHistory"); // Import medical history routes

const app = express();
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'Frontend.html'));
});


app.use(express.json());
app.use(cors());

// 🔹 MongoDB Database Connection Setup
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ Connected to MongoDB Atlas"))
.catch(err => console.error("❌ MongoDB connection error", err));

// Use Routes for authentication
app.use("/api/auth", authRoutes);
app.use("/api/medical-history", medicalHistoryRoutes); // Use medical history routes

// 🚀 Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
