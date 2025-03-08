const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/user"); // Import User model

const router = express.Router();

// 📄 Get User Medical History (Formatted Table)
router.get("/", async (req, res) => {
  const token = req.headers.authorization;
  if (!token) return res.status(401).json({ message: "❌ Unauthorized" });

  try {
    const tokenValue = token.split(" ")[1];
    const { userId } = jwt.verify(tokenValue, process.env.JWT_SECRET);
    
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "❌ User not found" });

    // Add Serial Number (S.No) and return formatted data
    const formattedHistory = user.medicalHistory.map((entry, index) => ({
      "S.No": index + 1,
      date: entry.date,
      disease: entry.disease, // Reason for visit
      doctor: entry.doctor,
      hospital: entry.hospital,
      medication: entry.medication,
      ID: entry._id // Unique ID of record
    }));

    res.json(formattedHistory);
  } catch (error) {
    res.status(401).json({ message: "❌ Invalid token" });
  }
});

// ➕ Add New Medical History Record
router.post("/", async (req, res) => {
  const token = req.headers.authorization;
  if (!token) return res.status(401).json({ message: "❌ Unauthorized" });

  try {
    const tokenValue = token.split(" ")[1];
    const { userId } = jwt.verify(tokenValue, process.env.JWT_SECRET);
    
    const { date, disease, doctor, hospital, medication } = req.body;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "❌ User not found" });

    user.medicalHistory.push({ date, disease, doctor, hospital, medication });
    await user.save();

    res.json({ message: "✅ Medical history added successfully!" });
  } catch (error) {
    res.status(401).json({ message: "❌ Invalid token" });
  }
});

module.exports = router;
