import { Invoice } from "../invoice/invoice.model.js";
import { Product } from "../product/product.model.js";
import { StockHistory } from "../stock/stockHistory.model.js";

const applyFinalizeLogic = async (invoice) => {
  for (const item of invoice.items) {
    const product = await Product.findById(item.product);

    if (!product) {
      throw new Error("Product not found");
    }

    if (product.quantity < item.quantity) {
      throw new Error("Insufficient stock");
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

  return invoice;
};

export const createInvoice = async (req, res, next) => {
  try {
    const { status } = req.body;

    const invoice = await Invoice.create({
      ...req.body,
      status: "DRAFT",
    });

    if (status === "FINALIZED") {
      const finalizedInvoice = await applyFinalizeLogic(invoice);
      return res.status(201).json(finalizedInvoice);
    }

    res.status(201).json(invoice);
  } catch (err) {
    next(err);
  }
};

export const finalizeInvoice = async (req, res, next) => {
  try {
    const { invoiceId } = req.params;

    const invoice = await Invoice.findById(invoiceId);

    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    if (invoice.status === "FINALIZED") {
      return res.status(400).json({ message: "Invoice already finalized" });
    }

    const finalizedInvoice = await applyFinalizeLogic(invoice);

    res.json(finalizedInvoice);
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
