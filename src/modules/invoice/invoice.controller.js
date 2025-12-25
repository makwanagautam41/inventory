import { Invoice } from "../invoice/invoice.model.js";
import { Product } from "../product/product.model.js";
import { StockHistory } from "../stock/stockHistory.model.js";
import { getNextInvoiceNumber } from "../invoice/invoice.utils.js";

const calculateInvoiceTotals = async (items) => {
  let subtotal = 0;
  const calculatedItems = [];

  for (const item of items) {
    const product = await Product.findById(item.product);

    if (!product) {
      throw new Error("Product not found");
    }

    if (item.quantity <= 0) {
      throw new Error("Quantity must be greater than zero");
    }

    const itemTotal = product.price * item.quantity;
    subtotal += itemTotal;

    calculatedItems.push({
      product: product._id,
      quantity: item.quantity,
      price: product.price,
      total: itemTotal,
    });
  }

  const tax = 0;
  const discount = 0;
  const grandTotal = subtotal + tax - discount;

  return {
    items: calculatedItems,
    subtotal,
    tax,
    discount,
    grandTotal,
  };
};

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

export const cancelInvoice = async (req, res, next) => {
  try {
    const { invoiceId } = req.params;

    const invoice = await Invoice.findById(invoiceId);

    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    if (invoice.status !== "FINALIZED") {
      return res.status(400).json({
        message: "Only finalized invoices can be cancelled",
      });
    }

    for (const item of invoice.items) {
      const product = await Product.findById(item.product);

      if (!product) {
        throw new Error("Product not found");
      }

      product.quantity += item.quantity;
      await product.save();

      await StockHistory.create({
        product: product._id,
        type: "IN",
        quantity: item.quantity,
        referenceType: "CANCEL",
        referenceId: invoice._id,
      });
    }

    invoice.status = "CANCELLED";
    await invoice.save();

    res.json(invoice);
  } catch (err) {
    next(err);
  }
};

export const createInvoice = async (req, res, next) => {
  try {
    const { items, status } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Invoice items are required" });
    }

    const totals = await calculateInvoiceTotals(items);
    const invoiceNumber = await getNextInvoiceNumber();

    const invoice = await Invoice.create({
      invoiceNumber,
      items: totals.items,
      subtotal: totals.subtotal,
      tax: totals.tax,
      discount: totals.discount,
      grandTotal: totals.grandTotal,
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
