import {
  createLead,
  getLeads,
  getLeadById,
  updateLead,
  deleteLead,
  convertLeadToCustomer,
} from "./lead.service.js";

import {
  createLeadSchema,
  updateLeadSchema,
} from "./lead.validation.js";

export const createLeadController =
  async (req, res, next) => {
    try {
      const data =
        createLeadSchema.parse(
          req.body
        );

      const lead =
        await createLead({
          organizationId:
            req.user.organizationId,

          userId:
            req.user.userId,

          data,
        });

      res.status(201).json({
        success: true,
        data: lead,
      });
    } catch (error) {
      next(error);
    }
  };

export const getLeadsController =
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
        await getLeads({
          organizationId:
            req.user.organizationId,

          page,

          limit,

          status:
            req.query.status,

          source:
            req.query.source,

          assignedTo:
            req.query.assignedTo,

          search:
            req.query.search,
        });

      res.status(200).json({
        success: true,
        data: result.leads,
        pagination:
          result.pagination,
      });
    } catch (error) {
      next(error);
    }
  };

export const getLeadController =
  async (req, res, next) => {
    try {
      const lead =
        await getLeadById({
          organizationId:
            req.user.organizationId,

          leadId:
            req.params.id,
        });

      res.status(200).json({
        success: true,
        data: lead,
      });
    } catch (error) {
      next(error);
    }
  };

export const updateLeadController =
  async (req, res, next) => {
    try {
      const data =
        updateLeadSchema.parse(
          req.body
        );

      const lead =
        await updateLead({
          organizationId:
            req.user.organizationId,

          userId:
            req.user.userId,

          leadId:
            req.params.id,

          data,
        });

      res.status(200).json({
        success: true,
        data: lead,
      });
    } catch (error) {
      next(error);
    }
  };

export const deleteLeadController =
  async (req, res, next) => {
    try {
      await deleteLead({
        organizationId:
          req.user.organizationId,

        leadId:
          req.params.id,
      });

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };

  export const convertLeadController =
  async (req, res, next) => {
    try {
      const result =
        await convertLeadToCustomer({
          organizationId:
            req.user.organizationId,

          userId:
            req.user.userId,

          leadId:
            req.params.id,
        });

      res.status(201).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };