
import { Router } from "express";

import authMiddleware from "../../middleware/auth.middleware.js";
import { requirePermission } from "../../middleware/permission.middleware.js";
import { validate } from "../../middleware/validate.middleware.js";

import {
  createPaymentController,
  getPaymentsController,
  getPaymentByIdController,
} from "./payment.controller.js";

import { createPaymentSchema } from "./payment.validation.js";
import { PERMISSIONS } from "../../config/permissions.js";
import {
  downloadPaymentPdfController,
} from "./payment-pdf.controller.js";

const router = Router();

router.use(authMiddleware);

// Get all payments
router.get(
  "/",
  requirePermission(PERMISSIONS.PAYMENT_VIEW),
  getPaymentsController
);

// Record payment
router.post(
  "/",
  requirePermission(PERMISSIONS.PAYMENT_CREATE),
  validate(createPaymentSchema),
  createPaymentController
);

// Download payment receipt PDF
router.get(
  "/:id/pdf",
  requirePermission(PERMISSIONS.PAYMENT_VIEW),
  downloadPaymentPdfController
);

// Get payment by ID
router.get(
  "/:id",
  requirePermission(PERMISSIONS.PAYMENT_VIEW),
  getPaymentByIdController
);

export default router;
