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

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
}).on('error', (err) => {
  console.error('❌ Error starting server:', err.message);
  process.exit(1);
});
