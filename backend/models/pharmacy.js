import mongoose from "mongoose";

const pharmacySchema = new mongoose.Schema({
  user_name: { type: String, required: true },
  owner_name: { type: String, required: true },
  address: { type: String },
  license_number: { type: String, unique: false },
  city: { type: String, required: true },
  state: { type: String },
  pincode: { type: String },
  latitude: { type: Number },
  longitude: { type: Number },
  opening_hours: { type: String },
  closing_hours: { type: String },
  phone_number: { type: String, required: true },
  password: { type: String, required: true },
});

// Prevent OverwriteModelError if imported multiple times
const Pharmacy =
  mongoose.models.Pharmacy || mongoose.model("Pharmacy", pharmacySchema);

export default Pharmacy;
