import express from "express";

import {
  createMilestoneController,
  getProjectMilestonesController,
  getMilestoneController,
  updateMilestoneController,
  deleteMilestoneController,
} from "./milestone.controller.js";

import authMiddleware from "../../middleware/auth.middleware.js";

import requirePermission from "../../middleware/permission.middleware.js";

import {
  PERMISSIONS,
} from "../../config/permissions.js";

const router = express.Router();

router.use(authMiddleware);


router.get(
  "/projects/:projectId/milestones",
  requirePermission(
    PERMISSIONS.MILESTONE_VIEW
  ),
  getProjectMilestonesController
);


router.post(
  "/projects/:projectId/milestones",
  requirePermission(
    PERMISSIONS.MILESTONE_CREATE
  ),
  createMilestoneController
);


router.get(
  "/:id",
  requirePermission(
    PERMISSIONS.MILESTONE_VIEW
  ),
  getMilestoneController
);


router.patch(
  "/:id",
  requirePermission(
    PERMISSIONS.MILESTONE_UPDATE
  ),
  updateMilestoneController
);


router.delete(
  "/:id",
  requirePermission(
    PERMISSIONS.MILESTONE_DELETE
  ),
  deleteMilestoneController
);


export default router;