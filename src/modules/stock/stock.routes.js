import express from "express";
import { authMiddleware } from "../../middlewares/authMiddleware.js";
import { stockIn, stockOut, getStockHistory } from "./stock.controller.js";

const router = express.Router();

router.post("/in", authMiddleware, stockIn);
router.post("/out", authMiddleware, stockOut);
router.get("/history", authMiddleware, getStockHistory);

export default router;
