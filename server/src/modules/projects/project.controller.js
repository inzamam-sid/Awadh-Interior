import {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
} from "./project.service.js";

import {
  createProjectSchema,
  updateProjectSchema,
} from "./project.validation.js";


export const createProjectController =
  async (req, res, next) => {
    try {
      const data =
        createProjectSchema.parse(
          req.body
        );

      const project =
        await createProject({
          organizationId:
            req.user.organizationId,

          userId:
            req.user.userId,

          data,
        });

      res.status(201).json({
        success: true,
        data: project,
      });
    } catch (error) {
      next(error);
    }
  };


export const getProjectsController =
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
        await getProjects({
          organizationId:
            req.user.organizationId,

          page,
          limit,

          status:
            req.query.status,

          customerId:
            req.query.customerId,

          projectManagerId:
            req.query.projectManagerId,

          search:
            req.query.search,
        });

      res.status(200).json({
        success: true,
        data: result.projects,
        pagination:
          result.pagination,
      });
    } catch (error) {
      next(error);
    }
  };


export const getProjectController =
  async (req, res, next) => {
    try {
      const project =
        await getProjectById({
          organizationId:
            req.user.organizationId,

          projectId:
            req.params.id,
        });

      res.status(200).json({
        success: true,
        data: project,
      });
    } catch (error) {
      next(error);
    }
  };


export const updateProjectController =
  async (req, res, next) => {
    try {
      const data =
        updateProjectSchema.parse(
          req.body
        );

      const project =
        await updateProject({
          organizationId:
            req.user.organizationId,

          userId:
            req.user.userId,

          projectId:
            req.params.id,

          data,
        });

      res.status(200).json({
        success: true,
        data: project,
      });
    } catch (error) {
      next(error);
    }
  };


export const deleteProjectController =
  async (req, res, next) => {
    try {
      await deleteProject({
        organizationId:
          req.user.organizationId,

        projectId:
          req.params.id,
      });

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };