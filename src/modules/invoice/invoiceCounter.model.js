import mongoose from "mongoose";

const invoiceCounterSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  seq: { type: Number, default: 0 },
});

export const InvoiceCounter = mongoose.model(
  "InvoiceCounter",
  invoiceCounterSchema
);
