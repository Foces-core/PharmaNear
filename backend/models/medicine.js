import mongoose from "mongoose";

const MedicationSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  strengths: [String],
  routes: [String],
});

// Prevent OverwriteModelError if this file is imported multiple times
const Medicine =
  mongoose.models.Medicine || mongoose.model("Medicine", MedicationSchema);

export default Medicine;
