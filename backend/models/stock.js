import mongoose from "mongoose";

function StockSchema() {
    const StockScehma = new mongoose.Schema({
        pharmacy_id: String,
        medication: String,
        quantity: Number,
        price: Number,
        medication_id: String,
        pharmacy_id: String,
    });
    const Stock = mongoose.model("Stock", StockScehma);
    return Stock;
}

export default StockSchema;