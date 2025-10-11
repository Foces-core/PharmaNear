import bcrypt from "bcrypt";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import Medicine from "./models/medicine.js";
import Pharmacy from "./models/pharmacy.js";
import Stock from "./models/stock.js";

dotenv.config();

const app = express();
const allowedOrigin = process.env.CORS_ORIGIN || "http://localhost:5173";
app.use(
  cors({
    origin: allowedOrigin,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    credentials: true,
  })
);

app.use(express.json());
mongoose
  .connect(
    process.env.MONGO_URL ||
      "mongodb+srv://spiny881_db_user:8p4g7wmqEZSFiTUI@pharmanear.2sd5gh7.mongodb.net/?retryWrites=true&w=majority&appName=PharmaNear",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log("✅ Connected to MongoDB");
    // Fetch drugs after successful connection
    //fetchDrugs();
  })
  .catch((err) => {
    console.log("❌ Error connecting to MongoDB", err);
  });

const port = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || "dev_secret";

// Test endpoint

// JWT Middleware
const AuthMiddleware = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.status(401).json({ message: "No token provided" });

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      if (err.name === "TokenExpiredError") {
        return res.status(401).json({ message: "Token expired" });
      }
      return res.status(403).json({ message: "Invalid token" });
    }

    req.user = decoded; // attach payload (e.g. userId)
    next();
  });
};

app.post("/api/pharmacy/signup", async (req, res) => {
  try {
    const { user_name, owner_name, city, phone_number, password } = req.body;

    if (!user_name || !owner_name || !city || !phone_number || !password) {
      return res.status(400).json({ message: "Invalid Entry" });
    }

    // Check if user already exists
    const existingPharmacy = await Pharmacy.findOne({ user_name });
    if (existingPharmacy) {
      return res
        .status(400)
        .json({ message: "Pharmacy name already registered" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create and save user
    const pharmacy = new Pharmacy({
      user_name,
      owner_name,
      city,
      phone_number,
      password: hashedPassword,
    });
    await pharmacy.save();

    // Generate JWT
    const token = jwt.sign(
      { id: pharmacy._id, user_name: pharmacy.user_name, role: pharmacy.role },
      JWT_SECRET,
      { expiresIn: "3h" }
    );
    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
    });
    res.json({
      message: "Pharmacy registered successfully",
      token,
      pharmacy: {
        id: pharmacy._id,
        user_name: pharmacy.user_name,
        owner_name: pharmacy.owner_name,
        city: pharmacy.city,
        phone_number: pharmacy.phone_number,
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
  console.log("Login request received:", req.body);

  const { user_name, password } = req.body;

  if (!user_name || !password) {
    console.log("Missing credentials");
    return res.status(400).json({ message: "Invalid credentials" });
  }

  try {
    // Find user by user_name
    const pharmacy = await Pharmacy.findOne({ user_name });
    console.log("Found pharmacy:", pharmacy ? "Yes" : "No");

    if (!pharmacy) {
      console.log("Pharmacy not found");
      return res
        .status(400)
        .json({ message: "Pharmacy is not registered. Please sign up." });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, pharmacy.password);
    console.log("Password match:", isMatch);

    if (!isMatch) {
      console.log("Password mismatch");
      return res.status(400).json({ message: "Password is incorrect" });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: pharmacy._id, user_name: pharmacy.user_name, role: pharmacy.role },
      JWT_SECRET,
      { expiresIn: "3h" }
    );

    console.log("Login successful, sending response");
    res.json({
      message: "Pharmacy logged in successfully",
      token,
      pharmacy: {
        id: pharmacy._id,
        user_name: pharmacy.user_name,
        owner_name: pharmacy.owner_name,
        city: pharmacy.city,
        phone_number: pharmacy.phone_number,
        role: pharmacy.role,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get pharmacy profile by user_name (authenticated)
app.get("/api/pharmacy/profile", AuthMiddleware, async (req, res) => {
  try {
    const { user_name } = req.query;
    if (!user_name)
      return res.status(400).json({ message: "user_name is required" });

    // Verify user can only access their own profile
    if (req.user.user_name !== user_name) {
      return res.status(403).json({ message: "Access denied" });
    }

    const pharmacy = await Pharmacy.findOne({ user_name });
    if (!pharmacy)
      return res.status(404).json({ message: "Pharmacy not found" });
    res.json(pharmacy);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get pharmacy details by ID (public endpoint for map display)
app.get("/api/pharmacy/details", async (req, res) => {
  try {
    const { pharmacy_id } = req.query;
    if (!pharmacy_id)
      return res.status(400).json({ message: "pharmacy_id is required" });

    const pharmacy = await Pharmacy.findById(pharmacy_id);
    if (!pharmacy)
      return res.status(404).json({ message: "Pharmacy not found" });

    // Return only necessary fields for map display
    res.json({
      _id: pharmacy._id,
      user_name: pharmacy.user_name,
      address: pharmacy.address,
      city: pharmacy.city,
      state: pharmacy.state,
      pincode: pharmacy.pincode,
      latitude: pharmacy.latitude,
      longitude: pharmacy.longitude,
      opening_hours: pharmacy.opening_hours,
      closing_hours: pharmacy.closing_hours,
      phone_number: pharmacy.phone_number,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Update pharmacy profile by user_name
app.put("/api/pharmacy/profile", AuthMiddleware, async (req, res) => {
  try {
    const { user_name } = req.body;
    if (!user_name)
      return res.status(400).json({ message: "user_name is required" });

    // Verify user can only update their own profile
    if (req.user.user_name !== user_name) {
      return res.status(403).json({ message: "Access denied" });
    }

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

    const pharmacy = await Pharmacy.findOneAndUpdate(
      { user_name },
      { $set: update },
      { new: true }
    );
    if (!pharmacy)
      return res.status(404).json({ message: "Pharmacy profile not found" });
    res.json({ message: "Profile updated", pharmacy });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});
// Add medicine stock for a pharmacy if medicine not exist it adds the medicine to the database and then adds to the stock
app.post("/api/pharmacy/stock", AuthMiddleware, async (req, res) => {
  try {
    const { pharmacy_id, medicine_name, quantity, price, strength } = req.body;

    // Validation
    if (!pharmacy_id)
      return res.status(400).json({ message: "Pharmacy ID is required" });
    if (!medicine_name)
      return res.status(400).json({ message: "Medicine name is required" });
    if (!quantity || quantity <= 0)
      return res.status(400).json({ message: "Valid quantity is required" });
    if (!price || price <= 0)
      return res.status(400).json({ message: "Valid price is required" });

    // Find medicine by name (case-insensitive exact match)
    let medicine = await Medicine.find({
      name: new RegExp(`^${medicine_name}$`, "i"),
    });

    if (medicine.length > 1) {
      return res
        .status(400)
        .json({ message: "Multiple medicines found with the same name" });
    }

    let medicineDoc;
    if (medicine.length === 0) {
      // Create new medicine
      medicineDoc = new Medicine({
        name: medicine_name,
        strengths: strength ? [strength] : [],
        routes: [],
      });
      await medicineDoc.save();
    } else {
      medicineDoc = medicine[0];
    }

    const medicine_id = medicineDoc._id;

    // Find stock for pharmacy
    let stock = await Stock.findOne({ pharmacy_id });

    if (stock) {
      // Update or insert medication
      const existingMedication = stock.medications.find(
        (med) => med.medicine_id.toString() === medicine_id.toString()
      );

      if (existingMedication) {
        existingMedication.quantity += parseInt(quantity);
        existingMedication.price = parseFloat(price);
      } else {
        stock.medications.push({
          medicine_id,
          quantity: parseInt(quantity),
          price: parseFloat(price),
        });
      }
      await stock.save();
    } else {
      // Create new stock document
      stock = new Stock({
        pharmacy_id,
        medications: [
          {
            medicine_id,
            quantity: parseInt(quantity),
            price: parseFloat(price),
          },
        ],
      });
      await stock.save();
    }

    res.json({ message: "Stock updated successfully", stock });
  } catch (error) {
    console.error("Error creating/updating stock:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get pharmacy stock by pharmacy_id
app.get("/api/pharmacy/stock", AuthMiddleware, async (req, res) => {
  try {
    console.log("Fetching stock for pharmacy_id:", req.query.pharmacy_id);

    const pharmacy_id = req.query.pharmacy_id || req.user?.id;
    if (!pharmacy_id) {
      console.log("No pharmacy_id provided");
      return res
        .status(400)
        .json({ message: "Pharmacy ID not found in request" });
    }

    const stock = await Stock.findOne({ pharmacy_id }).populate(
      "medications.medicine_id"
    );
    console.log("Stock found:", stock);

    if (!stock) {
      return res.status(404).json({ message: "No stock found" });
    }

    res.json(stock);
  } catch (error) {
    console.error("Error fetching stock:", error);
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/api/drugs", async (req, res) => {
  const medicine_name = req.query.name;

  if (!medicine_name) {
    return res.status(400).json({ message: "Medicine name is required" });
  }

  const drugs = await Medicine.find({
    name: { $regex: medicine_name, $options: "i" },
  });
  if (drugs.length === 0) {
    return res.json({ message: "No drugs found" });
  }

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

app.patch("/api/pharmacy/stock", AuthMiddleware, async (req, res) => {
  try {
    const { pharmacy_id, medicine_name, quantity, price } = req.body;
    console.log("Request body:", req.body);

    if (!pharmacy_id || !medicine_name || !quantity || !price) {
      return res.status(400).json({ message: "Invalid stock data" });
    }

    const medicine = await Medicine.findOne({
      name: { $regex: medicine_name, $options: "i" },
    });
    if (!medicine) {
      return res.status(404).json({ message: "Medicine not found" });
    }

    const stock = await Stock.findOne({
      pharmacy_id,
      "medications.medicine_id": medicine._id,
    });
    if (!stock) return res.status(404).json({ message: "Stock not found" });

    const existingMedication = stock.medications.find(
      (med) => med.medicine_id.toString() === medicine._id.toString()
    );
    if (!existingMedication)
      return res.status(404).json({ message: "Medication not found in stock" });

    existingMedication.quantity = parseInt(quantity, 10);
    existingMedication.price = parseFloat(price);

    await stock.save();
    res.json({ message: "Stock updated successfully", stock });
  } catch (error) {
    console.error("Error updating stock:", error);
    res.status(500).json({ message: "Server error" });
  }
});

app.delete("/api/pharmacy/stock", AuthMiddleware, async (req, res) => {
  try {
    const { pharmacy_id, medicine_name } = req.body;
    if (!pharmacy_id || !medicine_name) {
      return res.status(400).json({ message: "Invalid stock data" });
    }

    const medicine = await Medicine.findOne({
      name: { $regex: medicine_name, $options: "i" },
    });
    if (!medicine) {
      return res.status(404).json({ message: "Medicine not found" });
    }

    const stock = await Stock.findOne({ pharmacy_id });
    if (!stock) {
      return res.status(404).json({ message: "Stock not found" });
    }
    // Find the index of the medication entry to remove
    const existingMedicationIndex = stock.medications.findIndex(
      (med) => med.medicine_id.toString() === medicine._id.toString()
    );
    if (existingMedicationIndex === -1) {
      return res.status(404).json({ message: "Medication not found in stock" });
    }
    // Remove the medication entry
    stock.medications.splice(existingMedicationIndex, 1);
    await stock.save();
    res.json({ message: "Medication removed successfully", stock });
  } catch (error) {
    console.error("Error removing stock:", error);
    res.status(500).json({ message: "Server error" });
  }
});
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
