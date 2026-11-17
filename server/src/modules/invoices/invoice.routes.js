
import { Router } from "express";

import authMiddleware from "../../middleware/auth.middleware.js";
import { validate } from "../../middleware/validate.middleware.js";

import {
  createInvoiceController,
  getInvoicesController,
  getInvoiceByIdController,
} from "./invoice.controller.js";

import {
  createInvoiceSchema,
} from "./invoice.validation.js";

const router = Router();

// Authentication required for all invoice routes
router.use(authMiddleware);

// GET all invoices
router.get("/", getInvoicesController);

// CREATE invoice
router.post(
  "/",
  validate(createInvoiceSchema),
  createInvoiceController
);

// GET invoice by ID
router.get("/:id", getInvoiceByIdController);

export default router;
