import {
  createTask,
  getProjectTasks,
  getTaskById,
  updateTask,
  deleteTask,
} from "./task.service.js";

import {
  createTaskSchema,
  updateTaskSchema,
} from "./task.validation.js";


export const createTaskController =
  async (req, res, next) => {
    try {
      const data =
        createTaskSchema.parse(
          req.body
        );

      const task =
        await createTask({
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
        data: task,
      });
    } catch (error) {
      next(error);
    }
  };


export const getProjectTasksController =
  async (req, res, next) => {
    try {
      const tasks =
        await getProjectTasks({
          organizationId:
            req.user.organizationId,

          projectId:
            req.params.projectId,

          status:
            req.query.status,

          assignedTo:
            req.query.assignedTo,
        });

      res.status(200).json({
        success: true,
        data: tasks,
      });
    } catch (error) {
      next(error);
    }
  };


export const getTaskController =
  async (req, res, next) => {
    try {
      const task =
        await getTaskById({
          organizationId:
            req.user.organizationId,

          taskId:
            req.params.id,
        });

      res.status(200).json({
        success: true,
        data: task,
      });
    } catch (error) {
      next(error);
    }
  };


export const updateTaskController =
  async (req, res, next) => {
    try {
      const data =
        updateTaskSchema.parse(
          req.body
        );

      const task =
        await updateTask({
          organizationId:
            req.user.organizationId,

          userId:
            req.user.userId,

          taskId:
            req.params.id,

          data,
        });

      res.status(200).json({
        success: true,
        data: task,
      });
    } catch (error) {
      next(error);
    }
  };


export const deleteTaskController =
  async (req, res, next) => {
    try {
      await deleteTask({
        organizationId:
          req.user.organizationId,

        taskId:
          req.params.id,
      });

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };