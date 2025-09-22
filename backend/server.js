import cors from "cors";
import dotenv from "dotenv";
import express from "express";
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

app.post("/api/user/signup", async (req, res) => {
  const { role, name, email, password } = req.body;

  if (role !== "user") {
    return res.status(400).json({ message: "Invalid Entry" });
  }

  try {
    const UserSchema = await import("./models/user.js");
    const User = UserSchema.default();

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create and save user
    const user = new User({ name, email, password: hashedPassword, role });
    await user.save();

    // Generate JWT
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      message: "User registered successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// LOGIN
app.post("/api/user/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  try {
    const UserSchema = await import("./models/user.js");
    const User = UserSchema.default();

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    // Generate JWT
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      message: "User logged in successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

app.post("/api/pharmacy", async (req, res) => {
  const PharmacySchema = await import("./models/pharmacy.js");
  const Pharmacy = PharmacySchema.default();
  const pharmacy = new Pharmacy(req.body);
  await pharmacy.save();
  res.json({ message: "Pharmacy registered successfully" });
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
