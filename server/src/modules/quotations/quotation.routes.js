
import express from "express";

import {
  createQuotationController,
  getQuotationsController,
  getQuotationByIdController,
  updateQuotationController,
  deleteQuotationController,
  sendQuotationController,
  acceptQuotationController,
  rejectQuotationController,
} from "./quotation.controller.js";

import authMiddleware from "../../middleware/auth.middleware.js";
import requirePermission from "../../middleware/permission.middleware.js";
import { PERMISSIONS } from "../../config/permissions.js";

const router = express.Router();

router.use(authMiddleware);

// List quotations
router.get(
  "/",
  requirePermission(PERMISSIONS.QUOTATIONS_VIEW),
  getQuotationsController
);

// Create quotation
router.post(
  "/",
  requirePermission(PERMISSIONS.QUOTATIONS_CREATE),
  createQuotationController
);


router.patch(
  "/:id/send",
  requirePermission(PERMISSIONS.QUOTATIONS_SEND),
  sendQuotationController
);

router.patch(
  "/:id/accept",
  requirePermission(PERMISSIONS.QUOTATIONS_UPDATE),
  acceptQuotationController
);

router.patch(
  "/:id/reject",
  requirePermission(PERMISSIONS.QUOTATIONS_UPDATE),
  rejectQuotationController
);


// Get one quotation
router.get(
  "/:id",
  requirePermission(PERMISSIONS.QUOTATIONS_VIEW),
  getQuotationByIdController
);

// Update draft quotation
router.patch(
  "/:id",
  requirePermission(PERMISSIONS.QUOTATIONS_UPDATE),
  updateQuotationController
);

// Delete draft quotation
router.delete(
  "/:id",
  requirePermission(PERMISSIONS.QUOTATIONS_DELETE),
  deleteQuotationController
);

export default router;
