import mongoose from "mongoose";

const stockHistorySchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    type: String,
    quantity: Number,
    referenceType: String,
    referenceId: mongoose.Schema.Types.ObjectId,
  },
  { timestamps: true }
);

export const StockHistory = mongoose.model("StockHistory", stockHistorySchema);
