import express from "express";

import {
  setupOwnerController,
  loginController,
  getMeController,
} from "./auth.controller.js";

import authMiddleware from "../../middleware/auth.middleware.js";

const router = express.Router();

router.post(
  "/setup-owner",
  setupOwnerController
);

router.post(
  "/login",
  loginController
);

router.get(
  "/me",
  authMiddleware,
  getMeController
);

export default router;