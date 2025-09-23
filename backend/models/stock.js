import mongoose from "mongoose";

function StockSchema() {
  const StockSchema = new mongoose.Schema({
    pharmacy_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Pharmacy",
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

  const Stock = mongoose.model("Stock", StockSchema);
  return Stock;
}

export default StockSchema;
