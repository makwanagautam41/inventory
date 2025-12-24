import { Product } from "../product/product.model.js";
import { StockHistory } from "../stock/stockHistory.model.js";

export const stockIn = async (req, res, next) => {
  try {
    const { productId, quantity } = req.body;

    const product = await Product.findById(productId);
    product.quantity += quantity;
    await product.save();

    await StockHistory.create({
      product: productId,
      type: "IN",
      quantity,
    });

    res.json(product);
  } catch (err) {
    next(err);
  }
};

export const stockOut = async (req, res, next) => {
  try {
    const { productId, quantity } = req.body;

    const product = await Product.findById(productId);
    if (product.quantity < quantity) {
      return res.status(400).json({ message: "Insufficient stock" });
    }

    product.quantity -= quantity;
    await product.save();

    await StockHistory.create({
      product: productId,
      type: "OUT",
      quantity,
    });

    res.json(product);
  } catch (err) {
    next(err);
  }
};
