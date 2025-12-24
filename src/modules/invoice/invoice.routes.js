import express from "express";
import { authMiddleware } from "../../middlewares/authMiddleware.js";
import {
  createInvoice,
  getInvoices,
  finalizeInvoice,
} from "./invoice.controller.js";

const invoiceRouter = express.Router();

invoiceRouter.post("/create", authMiddleware, createInvoice);
invoiceRouter.get("/", authMiddleware, getInvoices);
invoiceRouter.post("/finalize/:invoiceId", authMiddleware, finalizeInvoice);

export default invoiceRouter;
