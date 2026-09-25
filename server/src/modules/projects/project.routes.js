import express from "express";

import {
  createProjectController,
  getProjectsController,
  getProjectController,
  updateProjectController,
  deleteProjectController,
} from "./project.controller.js";

import authMiddleware from "../../middleware/auth.middleware.js";

import requirePermission from "../../middleware/permission.middleware.js";

import {
  PERMISSIONS,
} from "../../config/permissions.js";

const router = express.Router();

router.use(authMiddleware);


router.get(
  "/",
  requirePermission(
    PERMISSIONS.PROJECT_VIEW
  ),
  getProjectsController
);


router.get(
  "/:id",
  requirePermission(
    PERMISSIONS.PROJECT_VIEW
  ),
  getProjectController
);


router.post(
  "/",
  requirePermission(
    PERMISSIONS.PROJECT_CREATE
  ),
  createProjectController
);


router.patch(
  "/:id",
  requirePermission(
    PERMISSIONS.PROJECT_UPDATE
  ),
  updateProjectController
);


router.delete(
  "/:id",
  requirePermission(
    PERMISSIONS.PROJECT_DELETE
  ),
  deleteProjectController
);


export default router;