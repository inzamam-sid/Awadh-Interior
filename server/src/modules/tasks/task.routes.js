import express from "express";

import {
  createTaskController,
  getProjectTasksController,
  getTaskController,
  updateTaskController,
  deleteTaskController,
} from "./task.controller.js";

import authMiddleware from "../../middleware/auth.middleware.js";

import requirePermission from "../../middleware/permission.middleware.js";

import {
  PERMISSIONS,
} from "../../config/permissions.js";

const router = express.Router();

router.use(authMiddleware);


// Project tasks
router.get(
  "/projects/:projectId/tasks",
  requirePermission(
    PERMISSIONS.TASK_VIEW
  ),
  getProjectTasksController
);


router.post(
  "/projects/:projectId/tasks",
  requirePermission(
    PERMISSIONS.TASK_CREATE
  ),
  createTaskController
);


// Individual task
router.get(
  "/:id",
  requirePermission(
    PERMISSIONS.TASK_VIEW
  ),
  getTaskController
);


router.patch(
  "/:id",
  requirePermission(
    PERMISSIONS.TASK_UPDATE
  ),
  updateTaskController
);


router.delete(
  "/:id",
  requirePermission(
    PERMISSIONS.TASK_DELETE
  ),
  deleteTaskController
);


export default router;