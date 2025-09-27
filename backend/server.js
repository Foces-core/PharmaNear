import bcrypt from "bcryptjs";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { fetchDrugs } from "./medicine.js";

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
    console.log("✅ Connected to MongoDB");
    // Fetch drugs after successful connection
    fetchDrugs();
  })
  .catch((err) => {
    console.log("❌ Error connecting to MongoDB", err);
  });

const port = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || "dev_secret";

app.post("/api/pharmacy/signup", async (req, res) => {
  try {
    const PharmacySchema = await import("./models/pharmacy.js");
    const Pharmacy = PharmacySchema.default();
    const { user_name, owner_name, city, contact_number, password } = req.body;

    if (!user_name || !owner_name || !city || !contact_number || !password) {
      return res.status(400).json({ message: "Invalid Entry" });
    }

    // Check if user already exists
    const existingPharmacy = await Pharmacy.findOne({ user_name });
    if (existingPharmacy) {
      return res.status(400).json({ message: "User name already registered" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create and save user
    const pharmacy = new Pharmacy({
      user_name,
      owner_name,
      city,
      contact_number,
      password: hashedPassword,
    });
    await pharmacy.save();

    // Generate JWT
    const token = jwt.sign(
      { id: pharmacy._id, user_name: pharmacy.user_name, role: pharmacy.role },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      message: "Pharmacy registered successfully",
      token,
      pharmacy: {
        id: pharmacy._id,
        user_name: pharmacy.user_name,
        owner_name: pharmacy.owner_name,
        city: pharmacy.city,
        contact_number: pharmacy.contact_number,
        role: pharmacy.role,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// LOGIN
app.post("/api/pharmacy/login", async (req, res) => {
  const { user_name, password } = req.body;

  if (!user_name || !password) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  try {
    const PharmacySchema = await import("./models/pharmacy.js");
    const Pharmacy = PharmacySchema.default();

    // Find user by email
    const pharmacy = await Pharmacy.findOne({ user_name });
    if (!pharmacy) return res.status(400).json({ message: "Invalid credentials" }); 

    // Compare password
    const isMatch = await bcrypt.compare(password, pharmacy.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    // Generate JWT
    const token = jwt.sign(
      { id: pharmacy._id, user_name: pharmacy.user_name, role: pharmacy.role },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      message: "Pharmacy logged in successfully",
      token,
      pharmacy: {
        id: pharmacy._id,
        user_name: pharmacy.user_name,
        owner_name: pharmacy.owner_name,
        city: pharmacy.city,
        contact_number: pharmacy.contact_number,
        role: pharmacy.role,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get pharmacy profile by user_name
app.get("/api/pharmacy/profile", async (req, res) => {
  try {
    const { user_name } = req.query;
    if (!user_name) return res.status(400).json({ message: "user_name is required" });
    const PharmacySchema = await import("./models/pharmacy.js");
    const Pharmacy = PharmacySchema.default();
    const pharmacy = await Pharmacy.findOne({ user_name });
    if (!pharmacy) return res.status(404).json({ message: "Pharmacy not found" });
    res.json(pharmacy);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Update pharmacy profile by user_name
app.put("/api/pharmacy/profile", async (req, res) => {
  try {
    const { user_name } = req.body;
    if (!user_name) return res.status(400).json({ message: "user_name is required" });

    const allowed = [
      "license_number",
      "address",
      "city",
      "state",
      "pincode",
      "opening_hours",
      "closing_hours",
      "contact_number",
      "latitude",
      "longitude",
    ];
    const update = {};
    for (const key of allowed) if (key in req.body) update[key] = req.body[key];

    const PharmacySchema = await import("./models/pharmacy.js");
    const Pharmacy = PharmacySchema.default();
    const pharmacy = await Pharmacy.findOneAndUpdate(
      { user_name },
      { $set: update },
      { new: true }
    );
    if (!pharmacy) return res.status(404).json({ message: "Pharmacy not found" });
    res.json({ message: "Profile updated", pharmacy });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});


app.post("/api/pharmacy/stock", async (req, res) => {
  const StockSchema = await import("./models/stock.js");
  const Stock = StockSchema.default();
  const stock = new Stock(req.body);
  await stock.save();
  res.json({ message: "Stock registered successfully" });
});

app.get("/api/drugs", async (req, res) => {
  const medicine_name = req.body.name;
  const MedicineSchema = await import("./models/medicine.js");
  const Medicine = MedicineSchema.default();
  const drugs = await Medicine.find({
    name: { $regex: medicine_name, $options: "i" },
  });
  if (drugs.length === 0) {
    return res.json({ message: "No drugs found" });
  }
  const StockSchema = await import("./models/stock.js");
  const Stock = StockSchema.default();

  // Find all pharmacies that have the medicine
  const stocks = await Stock.find({
    "medications.medicine_id": drugs[0]._id,
  });

  if (stocks.length === 0) {
    return res.json({ message: "No stock found" });
  }

  // Map each pharmacy to its specific medicine entry
  const result = stocks.map((stock) => {
    const medicationEntry = stock.medications.find(
      (m) => m.medicine_id.toString() === drugs[0]._id.toString()
    );
    return {
      pharmacy_id: stock.pharmacy_id,
      stock: medicationEntry,
    };
  });
  res.json({ drug: drugs[0], stocks: result });
});

app
  .listen(port, () => {
    console.log(`Server is running on port ${port}`);
  })
  .on("error", (err) => {
    console.error("❌ Error starting server:", err.message);
    process.exit(1);
  });
