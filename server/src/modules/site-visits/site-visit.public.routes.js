import express from "express";

import {
  createPublicSiteVisitController,
} from "./site-visit.controller.js";

const router = express.Router();

router.post(
  "/site-visits",
  createPublicSiteVisitController
);

export default router;