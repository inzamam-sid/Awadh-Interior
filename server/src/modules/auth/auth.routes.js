import express from "express";

import {
  setupOwnerController,
  loginController,
  getMeController,
  refreshController,
  logoutController,
} from "./auth.controller.js";

import authMiddleware from "../../middleware/auth.middleware.js";

import requirePermission from "../../middleware/permission.middleware.js";

import { PERMISSIONS } from "../../config/permissions.js";


const router = express.Router();

router.post(
  "/setup-owner",
  setupOwnerController
);

router.post(
  "/login",
  loginController
);

router.post(
  "/refresh",
  refreshController
);

router.post(
  "/logout",
  logoutController
);

router.get(
  "/me",
  authMiddleware,
  requirePermission(PERMISSIONS.USER_VIEW),
  getMeController
);



export default router;