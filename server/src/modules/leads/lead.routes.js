import express from "express";

import {
  createLeadController,
  getLeadsController,
  getLeadController,
  updateLeadController,
  deleteLeadController,
    convertLeadController,
} from "./lead.controller.js";

import authMiddleware from "../../middleware/auth.middleware.js";

import requirePermission, {
  requireAllPermissions,
} from "../../middleware/permission.middleware.js";

import { PERMISSIONS } from "../../config/permissions.js";

const router = express.Router();

router.use(authMiddleware);

router.get(
  "/",
  requirePermission(
    PERMISSIONS.LEAD_VIEW
  ),
  getLeadsController
);

router.post(
  "/:id/convert",
  requireAllPermissions([
    PERMISSIONS.LEAD_UPDATE,
    PERMISSIONS.CUSTOMER_CREATE,
  ]),
  convertLeadController
);

router.get(
  "/:id",
  requirePermission(
    PERMISSIONS.LEAD_VIEW
  ),
  getLeadController
);

router.post(
  "/",
  requirePermission(
    PERMISSIONS.LEAD_CREATE
  ),
  createLeadController
);

router.patch(
  "/:id",
  requirePermission(
    PERMISSIONS.LEAD_UPDATE
  ),
  updateLeadController
);

router.delete(
  "/:id",
  requirePermission(
    PERMISSIONS.LEAD_DELETE
  ),
  deleteLeadController
);

export default router;