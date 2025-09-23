import mongoose from "mongoose";

function PharmacySchema() {
  const PharmacySchema = new mongoose.Schema({
    pharmacy_id: String,
    name: String,
    address: String,
    city: String,
    state: String,
    pincode: String,
    license_number: String,
    contact_number: String,
    email: String,
  });
  const Pharmacy = mongoose.model("Pharmacy", PharmacySchema);
  return Pharmacy;
}

export default PharmacySchema;
