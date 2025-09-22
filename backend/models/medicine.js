import mongoose from "mongoose";

const MedicationSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  strengths: [String],
  routes: [String],
});

const Medicine = mongoose.model("Medicine", MedicationSchema);

export default Medicine;
export { MedicationSchema };
