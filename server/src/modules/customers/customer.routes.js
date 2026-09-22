import express from "express";

import {
  createCustomerController,
  getCustomersController,
  getCustomerController,
  updateCustomerController,
  deleteCustomerController,
} from "./customer.controller.js";

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
    PERMISSIONS.CUSTOMER_VIEW
  ),
  getCustomersController
);


router.get(
  "/:id",
  requirePermission(
    PERMISSIONS.CUSTOMER_VIEW
  ),
  getCustomerController
);


router.post(
  "/",
  requirePermission(
    PERMISSIONS.CUSTOMER_CREATE
  ),
  createCustomerController
);


router.patch(
  "/:id",
  requirePermission(
    PERMISSIONS.CUSTOMER_UPDATE
  ),
  updateCustomerController
);


router.delete(
  "/:id",
  requirePermission(
    PERMISSIONS.CUSTOMER_DELETE
  ),
  deleteCustomerController
);


export default router;