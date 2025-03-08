console.log("Server script is running...");

require("dotenv").config();
console.log(process.env.MONGO_URI);
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

console.log("Starting server...");
const app = express();
app.use(express.json());
app.use(cors());

//Connecting to the database with MongoDB
console.log("Connecting to MongoDB...");
const connectDB = async () => {
    try {
      await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log("MongoDB Connected");
    } catch (err) {
      console.error("MongoDB connection error:", err);
    }
  };
  connectDB();


// User diagnosis and parameters
const UserSchema = new mongoose.Schema({
  email: String,
  password: String,
  medicalHistory: [
    {
      date: String,
      disease: String,
      doctor: String,
      hospital: String,
      medication: String,
    },
  ],
});

const User = mongoose.model("User", UserSchema);

// User Signup
app.post("/signup", async (req, res) => {
  const { email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = new User({ email, password: hashedPassword, medicalHistory: [] });
  await newUser.save();
  
  res.json({ message: "User registered successfully" });
});

// User Login
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
  res.json({ token });
});

// Get User Medical History
app.get("/medical-history", async (req, res) => {
  const token = req.headers.authorization;
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    const { userId } = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(userId);
    res.json(user.medicalHistory);
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
});

// Add New Medical Visit
app.post("/medical-history", async (req, res) => {
  const token = req.headers.authorization;
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    const { userId } = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(userId);

    user.medicalHistory.push(req.body);
    await user.save();

    res.json({ message: "Medical history added" });
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
});

// Start Server
const PORT = process.env.PORT || 5000;
console.log(`Starting server on port ${PORT}...`);
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
