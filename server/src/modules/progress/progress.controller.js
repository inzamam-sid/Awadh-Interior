import {
  createProgress,
  getProjectProgress,
  getProgressById,
  updateProgress,
  deleteProgress,
} from "./progress.service.js";

import {
  createProgressSchema,
  updateProgressSchema,
} from "./progress.validation.js";


export const createProgressController =
  async (req, res, next) => {
    try {
      const data =
        createProgressSchema.parse(
          req.body
        );

      const progress =
        await createProgress({
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
        data: progress,
      });
    } catch (error) {
      next(error);
    }
  };


export const getProjectProgressController =
  async (req, res, next) => {
    try {
      const progress =
        await getProjectProgress({
          organizationId:
            req.user.organizationId,

          projectId:
            req.params.projectId,
        });

      res.status(200).json({
        success: true,
        data: progress,
      });
    } catch (error) {
      next(error);
    }
  };


export const getProgressController =
  async (req, res, next) => {
    try {
      const progress =
        await getProgressById({
          organizationId:
            req.user.organizationId,

          progressId:
            req.params.id,
        });

      res.status(200).json({
        success: true,
        data: progress,
      });
    } catch (error) {
      next(error);
    }
  };


export const updateProgressController =
  async (req, res, next) => {
    try {
      const data =
        updateProgressSchema.parse(
          req.body
        );

      const progress =
        await updateProgress({
          organizationId:
            req.user.organizationId,

          progressId:
            req.params.id,

          data,
        });

      res.status(200).json({
        success: true,
        data: progress,
      });
    } catch (error) {
      next(error);
    }
  };


export const deleteProgressController =
  async (req, res, next) => {
    try {
      await deleteProgress({
        organizationId:
          req.user.organizationId,

        progressId:
          req.params.id,
      });

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };