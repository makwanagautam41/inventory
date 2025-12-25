import { Product } from "../product/product.model.js";

export const createProduct = async (req, res, next) => {
  try {
    const { name, price, sku, lowStockLimit } = req.body;

    if (!name || !sku || price == null) {
      return res.status(400).json({
        message: "Name, SKU and price are required",
      });
    }

    if (typeof price !== "number" || price <= 0) {
      return res.status(400).json({
        message: "Price must be a positive number",
      });
    }

    if (
      lowStockLimit != null &&
      (typeof lowStockLimit !== "number" || lowStockLimit < 0)
    ) {
      return res.status(400).json({
        message: "Low stock limit must be a non-negative number",
      });
    }

    const existingProduct = await Product.findOne({ sku });

    if (existingProduct) {
      return res.status(409).json({
        message: "Product with this SKU already exists",
      });
    }

    const product = await Product.create({
      name,
      price,
      sku,
      lowStockLimit,
    });

    res.status(201).json(product);
  } catch (err) {
    next(err);
  }
};

export const getProducts = async (req, res, next) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    next(err);
  }
};
