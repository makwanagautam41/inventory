import { InvoiceCounter } from "./invoiceCounter.model.js";

export const getNextInvoiceNumber = async () => {
  const year = new Date().getFullYear();
  const counterName = `invoice-${year}`;

  const counter = await InvoiceCounter.findOneAndUpdate(
    { name: counterName },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );

  return counter.seq;
};
