import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";

dotenv.config();

const app = express();

app.use(cors());

app.use(express.json());
mongoose
  .connect(process.env.MONGO_URL || "mongodb://localhost:27017/PharmaNear", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log("Error connecting to MongoDB", err);
  });

const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
});

const Users = mongoose.model("Users", UserSchema);

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

const StockScehma = new mongoose.Schema({
  pharmacy_id: String,
  medication: String,
  quantity: Number,
  price: Number,
  medication_id: String,
  pharmacy_id: String,
});
const Stock = mongoose.model("Stock", StockScehma);

const MedicationSchema = new mongoose.Schema({
  inn: { type: String, required: true },
});
const Medicine = mongoose.model("Medicine", MedicationSchema);

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
