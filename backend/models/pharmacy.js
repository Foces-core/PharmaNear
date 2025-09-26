import mongoose from "mongoose";

function PharmacySchema() {
  const PharmacySchema = new mongoose.Schema({
    user_name: {
      type: String,
      required: true,
    },
    owner_name: {
      type: String,
      required: true,
    },
    address: {
      type: String,
    },
    license_number: {
      type: String,
      unique: false,
    },
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
    },
    pincode: {
      type: String,
    },
    latitude: {
      type: Number,
    },
    longitude: {
      type: Number,
    },
    opening_hours: {
      type: String,
    },
    closing_hours: {
      type: String,
    },
    contact_number: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  });
  const Pharmacy = mongoose.model("Pharmacy", PharmacySchema);
  return Pharmacy;
}

export default PharmacySchema;
