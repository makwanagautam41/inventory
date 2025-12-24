import mongoose from "mongoose";
import { Invoice } from "../invoice/invoice.model.js";
import { Product } from "../product/product.model.js";
import { StockHistory } from "../stock/stockHistory.model.js";

export const createInvoice = async (req, res, next) => {
  try {
    const invoice = await Invoice.create(req.body);
    res.status(201).json(invoice);
  } catch (err) {
    next(err);
  }
};

export const getInvoices = async (req, res, next) => {
  try {
    const { type } = req.query;

    const filter = {};

    if (type) {
      filter.status = type.toUpperCase();
    }

    const invoices = await Invoice.find(filter).sort({ createdAt: -1 });

    res.json(invoices);
  } catch (err) {
    next(err);
  }
};

// export const finalizeInvoice = async (req, res, next) => {
//   const session = await mongoose.startSession();
//   session.startTransaction();

//   try {
//     const invoice = await Invoice.findById(req.params.id).session(session);

//     for (const item of invoice.items) {
//       const product = await Product.findById(item.product).session(session);
//       if (product.quantity < item.quantity) {
//         throw new Error("Insufficient stock");
//       }

//       product.quantity -= item.quantity;
//       await product.save();

//       await StockHistory.create(
//         [
//           {
//             product: product._id,
//             type: "OUT",
//             quantity: item.quantity,
//             referenceType: "INVOICE",
//             referenceId: invoice._id,
//           },
//         ],
//         { session }
//       );
//     }

//     invoice.status = "FINALIZED";
//     await invoice.save();

//     await session.commitTransaction();
//     session.endSession();

//     res.json(invoice);
//   } catch (err) {
//     await session.abortTransaction();
//     session.endSession();
//     next(err);
//   }
// };

export const finalizeInvoice = async (req, res, next) => {
  try {
    const { invoiceId } = req.params;

    if (!invoiceId) {
      return res.status(400).json({ message: "Invoice ID is required" });
    }

    const invoice = await Invoice.findById(invoiceId);

    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    if (invoice.status === "FINALIZED") {
      return res.status(400).json({ message: "Invoice already finalized" });
    }

    for (const item of invoice.items) {
      const product = await Product.findById(item.product);

      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      if (product.quantity < item.quantity) {
        return res.status(400).json({ message: "Insufficient stock" });
      }

      product.quantity -= item.quantity;
      await product.save();

      await StockHistory.create({
        product: product._id,
        type: "OUT",
        quantity: item.quantity,
        referenceType: "INVOICE",
        referenceId: invoice._id,
      });
    }

    invoice.status = "FINALIZED";
    await invoice.save();

    res.json(invoice);
  } catch (err) {
    next(err);
  }
};
