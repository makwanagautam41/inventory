import express from "express";
import authRoutes from "../modules/auth/auth.routes.js";
import productRoutes from "../modules/product/product.routes.js";
// import invoiceRoutes from "../modules/invoice/invoice.routes.js";
// import stockRoutes from "../modules/stock/stock.routes.js";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/products", productRoutes);
// router.use("/invoices", invoiceRoutes);
// router.use("/stock", stockRoutes);

export default router;
