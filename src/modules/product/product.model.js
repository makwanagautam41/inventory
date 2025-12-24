import mongoose, { mongo } from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: String,
    price: Number,
    sku: {
      type: String,
      unique: true,
    },

    quantity: {
      type: Number,
      default: 0,
    },

    lowStockLimit: Number,
  },
  { timestamps: true }
);

export const Product = mongoose.model("Product", productSchema);
