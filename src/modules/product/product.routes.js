import express from "express";
import { authMiddleware } from "../../middlewares/authMiddleware.js";
import { createProduct, getProducts } from "./product.controller.js";

const router = express.Router();

router.get("/", authMiddleware, getProducts);
router.post("/create", authMiddleware, createProduct);

export default router;
