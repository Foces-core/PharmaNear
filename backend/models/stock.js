import mongoose from "mongoose";

const StockSchema = new mongoose.Schema({
  pharmacy_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Pharmacy",
    required: true,
  },
  medications: [
    {
      medicine_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Medicine",
      },
      quantity: Number,
      price: Number,
    },
  ],
});

// Export the model safely to prevent OverwriteModelError
export default mongoose.models.Stock || mongoose.model("Stock", StockSchema);
