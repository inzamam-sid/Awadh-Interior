import { Router } from "express";
import authMiddleware from "../../middleware/auth.middleware.js";
import { requirePermission } from "../../middleware/permission.middleware.js";
import { getDashboardController } from "./dashboard.controller.js";
import { PERMISSIONS } from "../../config/permissions.js";

const router = Router();

router.use(authMiddleware);

router.get(
  "/",
  requirePermission(PERMISSIONS.DASHBOARD_VIEW),
  getDashboardController
);

export default router;