import {
  createSiteVisit,
  getSiteVisits,
  getSiteVisitById,
  updateSiteVisit,
  deleteSiteVisit,
} from "./site-visit.service.js";

import {
  createSiteVisitSchema,
  updateSiteVisitSchema,
} from "./site-visit.validation.js";


export const createSiteVisitController =
  async (req, res, next) => {
    try {
      const data =
        createSiteVisitSchema.parse(
          req.body
        );

      const siteVisit =
        await createSiteVisit({
          organizationId:
            req.user.organizationId,

          userId:
            req.user.userId,

          data,
        });

      res.status(201).json({
        success: true,
        data: siteVisit,
      });
    } catch (error) {
      next(error);
    }
  };


export const getSiteVisitsController =
  async (req, res, next) => {
    try {
      const page = Math.max(
        Number(req.query.page) || 1,
        1
      );

      const limit = Math.min(
        Math.max(
          Number(req.query.limit) || 20,
          1
        ),
        100
      );

      const result =
        await getSiteVisits({
          organizationId:
            req.user.organizationId,

          page,

          limit,

          status:
            req.query.status,

          assignedTo:
            req.query.assignedTo,

          from:
            req.query.from,

          to:
            req.query.to,
        });

      res.status(200).json({
        success: true,
        data: result.siteVisits,
        pagination:
          result.pagination,
      });
    } catch (error) {
      next(error);
    }
  };


export const getSiteVisitController =
  async (req, res, next) => {
    try {
      const siteVisit =
        await getSiteVisitById({
          organizationId:
            req.user.organizationId,

          siteVisitId:
            req.params.id,
        });

      res.status(200).json({
        success: true,
        data: siteVisit,
      });
    } catch (error) {
      next(error);
    }
  };


export const updateSiteVisitController =
  async (req, res, next) => {
    try {
      const data =
        updateSiteVisitSchema.parse(
          req.body
        );

      const siteVisit =
        await updateSiteVisit({
          organizationId:
            req.user.organizationId,

          userId:
            req.user.userId,

          siteVisitId:
            req.params.id,

          data,
        });

      res.status(200).json({
        success: true,
        data: siteVisit,
      });
    } catch (error) {
      next(error);
    }
  };


export const deleteSiteVisitController =
  async (req, res, next) => {
    try {
      await deleteSiteVisit({
        organizationId:
          req.user.organizationId,

        siteVisitId:
          req.params.id,
      });

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };