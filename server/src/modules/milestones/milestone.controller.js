import {
  createMilestone,
  getProjectMilestones,
  getMilestoneById,
  updateMilestone,
  deleteMilestone,
} from "./milestone.service.js";

import {
  createMilestoneSchema,
  updateMilestoneSchema,
} from "./milestone.validation.js";


export const createMilestoneController =
  async (req, res, next) => {
    try {
      const data =
        createMilestoneSchema.parse(
          req.body
        );

      const milestone =
        await createMilestone({
          organizationId:
            req.user.organizationId,

          projectId:
            req.params.projectId,

          userId:
            req.user.userId,

          data,
        });

      res.status(201).json({
        success: true,
        data: milestone,
      });
    } catch (error) {
      next(error);
    }
  };


export const getProjectMilestonesController =
  async (req, res, next) => {
    try {
      const milestones =
        await getProjectMilestones({
          organizationId:
            req.user.organizationId,

          projectId:
            req.params.projectId,
        });

      res.status(200).json({
        success: true,
        data: milestones,
      });
    } catch (error) {
      next(error);
    }
  };


export const getMilestoneController =
  async (req, res, next) => {
    try {
      const milestone =
        await getMilestoneById({
          organizationId:
            req.user.organizationId,

          milestoneId:
            req.params.id,
        });

      res.status(200).json({
        success: true,
        data: milestone,
      });
    } catch (error) {
      next(error);
    }
  };


export const updateMilestoneController =
  async (req, res, next) => {
    try {
      const data =
        updateMilestoneSchema.parse(
          req.body
        );

      const milestone =
        await updateMilestone({
          organizationId:
            req.user.organizationId,

          userId:
            req.user.userId,

          milestoneId:
            req.params.id,

          data,
        });

      res.status(200).json({
        success: true,
        data: milestone,
      });
    } catch (error) {
      next(error);
    }
  };


export const deleteMilestoneController =
  async (req, res, next) => {
    try {
      await deleteMilestone({
        organizationId:
          req.user.organizationId,

        milestoneId:
          req.params.id,
      });

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };