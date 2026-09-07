import express from "express";

import {
  setupOwnerController,
  loginController,
} from "./auth.controller.js";

const router = express.Router();

router.post(
  "/setup-owner",
  setupOwnerController
);

router.post(
  "/login",
  loginController
);

export default router;