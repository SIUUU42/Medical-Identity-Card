const mongoose = require("mongoose");

const medicalHistorySchema = new mongoose.Schema({
  date: { type: String, required: true }, // Date of visit
  disease: { type: String, required: true }, // Reason for visit
  doctor: { type: String, required: true }, // Doctor's name
  hospital: { type: String, required: true }, // Hospital name
  medication: { type: String, required: true } // Medication prescribed
}, { timestamps: true });

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  medicalHistory: [medicalHistorySchema] // Store medical history as an array
});

const User = mongoose.model("User", userSchema);
module.exports = User;
