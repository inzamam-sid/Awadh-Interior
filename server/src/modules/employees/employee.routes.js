import express from "express";

import {
  createEmployeeController,
  getEmployeesController,
  getEmployeeController,
  updateEmployeeController,
  deleteEmployeeController,
} from "./employee.controller.js";

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
    PERMISSIONS.EMPLOYEE_VIEW
  ),
  getEmployeesController
);


router.get(
  "/:id",
  requirePermission(
    PERMISSIONS.EMPLOYEE_VIEW
  ),
  getEmployeeController
);


router.post(
  "/",
  requirePermission(
    PERMISSIONS.EMPLOYEE_CREATE
  ),
  createEmployeeController
);


router.patch(
  "/:id",
  requirePermission(
    PERMISSIONS.EMPLOYEE_UPDATE
  ),
  updateEmployeeController
);


router.delete(
  "/:id",
  requirePermission(
    PERMISSIONS.EMPLOYEE_DELETE
  ),
  deleteEmployeeController
);


export default router;