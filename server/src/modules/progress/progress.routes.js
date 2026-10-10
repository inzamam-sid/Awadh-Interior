import express from "express";

import {
  createProgressController,
  getProjectProgressController,
  getProgressController,
  updateProgressController,
  deleteProgressController,
} from "./progress.controller.js";

import authMiddleware from "../../middleware/auth.middleware.js";

import requirePermission from "../../middleware/permission.middleware.js";

import {
  PERMISSIONS,
} from "../../config/permissions.js";

const router = express.Router();

router.use(authMiddleware);


router.get(
  "/projects/:projectId/progress",
  requirePermission(
    PERMISSIONS.PROGRESS_VIEW
  ),
  getProjectProgressController
);


router.post(
  "/projects/:projectId/progress",
  requirePermission(
    PERMISSIONS.PROGRESS_CREATE
  ),
  createProgressController
);


router.get(
  "/:id",
  requirePermission(
    PERMISSIONS.PROGRESS_VIEW
  ),
  getProgressController
);


router.patch(
  "/:id",
  requirePermission(
    PERMISSIONS.PROGRESS_UPDATE
  ),
  updateProgressController
);


router.delete(
  "/:id",
  requirePermission(
    PERMISSIONS.PROGRESS_DELETE
  ),
  deleteProgressController
);


export default router;