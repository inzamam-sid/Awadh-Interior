import express from "express";

import {
  createSiteVisitController,
  getSiteVisitsController,
  getSiteVisitController,
  updateSiteVisitController,
  deleteSiteVisitController,
} from "./site-visit.controller.js";

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
    PERMISSIONS.SITE_VISIT_VIEW
  ),
  getSiteVisitsController
);


router.get(
  "/:id",
  requirePermission(
    PERMISSIONS.SITE_VISIT_VIEW
  ),
  getSiteVisitController
);


router.post(
  "/",
  requirePermission(
    PERMISSIONS.SITE_VISIT_CREATE
  ),
  createSiteVisitController
);


router.patch(
  "/:id",
  requirePermission(
    PERMISSIONS.SITE_VISIT_UPDATE
  ),
  updateSiteVisitController
);


router.delete(
  "/:id",
  requirePermission(
    PERMISSIONS.SITE_VISIT_DELETE
  ),
  deleteSiteVisitController
);


export default router;