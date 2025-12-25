import mongoose from "mongoose";

const invoiceSchema = new mongoose.Schema(
  {
    invoiceNumber: {
      type: Number,
      required: true,
      unique: true,
    },
    items: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        quantity: Number,
        price: Number,
        total: Number,
      },
    ],
    subtotal: Number,
    tax: Number,
    discount: Number,
    grandTotal: Number,
    status: { type: String, default: "DRAFT" },
  },
  { timestamps: true }
);

export const Invoice = mongoose.model("Invoice", invoiceSchema);
