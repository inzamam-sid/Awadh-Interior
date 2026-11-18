
import { Router } from "express";

import authMiddleware from "../../middleware/auth.middleware.js";
import { requirePermission } from "../../middleware/permission.middleware.js";
import { validate } from "../../middleware/validate.middleware.js";

import {
  createInvoiceController,
  getInvoicesController,
  getInvoiceByIdController,
  updateInvoiceController,
} from "./invoice.controller.js";

import {
  createInvoiceSchema,
  updateInvoiceSchema,
} from "./invoice.validation.js";

import { PERMISSIONS } from "../../config/permissions.js";

const router = Router();

router.use(authMiddleware);

// Get all invoices
router.get(
  "/",
  requirePermission(PERMISSIONS.INVOICE_VIEW),
  getInvoicesController
);

// Create invoice
router.post(
  "/",
  requirePermission(PERMISSIONS.INVOICE_CREATE),
  validate(createInvoiceSchema),
  createInvoiceController
);

// Get invoice by ID
router.get(
  "/:id",
  requirePermission(PERMISSIONS.INVOICE_VIEW),
  getInvoiceByIdController
);

// Update invoice
router.patch(
  "/:id",
  requirePermission(PERMISSIONS.INVOICE_UPDATE),
  validate(updateInvoiceSchema),
  updateInvoiceController
);

export default router;
