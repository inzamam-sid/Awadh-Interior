import mongoose from "mongoose";

import Task from "./task.model.js";
import Project from "../projects/project.model.js";
import Employee from "../employees/employee.model.js";

import ApiError from "../../utils/api-error.js";

export const createTask = async ({
  organizationId,
  projectId,
  userId,
  data,
}) => {
  if (
    !mongoose.Types.ObjectId.isValid(
      projectId
    )
  ) {
    throw new ApiError(
      400,
      "INVALID_PROJECT_ID",
      "Invalid project ID."
    );
  }

  const project =
    await Project.findOne({
      _id: projectId,
      organizationId,
    });

  if (!project) {
    throw new ApiError(
      404,
      "PROJECT_NOT_FOUND",
      "Project not found."
    );
  }

  if (data.assignedTo) {
    if (
      !mongoose.Types.ObjectId.isValid(
        data.assignedTo
      )
    ) {
      throw new ApiError(
        400,
        "INVALID_EMPLOYEE_ID",
        "Invalid employee ID."
      );
    }

    const employee =
      await Employee.findOne({
        _id: data.assignedTo,
        organizationId,
        status: "ACTIVE",
      });

    if (!employee) {
      throw new ApiError(
        400,
        "INVALID_TASK_ASSIGNEE",
        "Employee is invalid or inactive."
      );
    }

    // Optional but useful:
    // ensure the employee belongs
    // to this project's team.
    const isProjectMember =
      project.assignedEmployees.some(
        (employeeId) =>
          employeeId.toString() ===
          data.assignedTo
      );

    if (!isProjectMember) {
      throw new ApiError(
        400,
        "EMPLOYEE_NOT_ON_PROJECT",
        "Employee is not assigned to this project."
      );
    }
  }

  const taskData = {
    ...data,
    organizationId,
    projectId,
    createdBy: userId,
  };

  if (data.dueDate) {
    taskData.dueDate =
      new Date(data.dueDate);
  }

  if (
    taskData.status === "COMPLETED"
  ) {
    taskData.completedAt =
      new Date();
  }

  const task =
    await Task.create(taskData);

  return task;
};

export const getProjectTasks =
  async ({
    organizationId,
    projectId,
    status,
    assignedTo,
  }) => {
    const project =
      await Project.findOne({
        _id: projectId,
        organizationId,
      });

    if (!project) {
      throw new ApiError(
        404,
        "PROJECT_NOT_FOUND",
        "Project not found."
      );
    }

    const filter = {
      organizationId,
      projectId,
    };

    if (status) {
      filter.status = status;
    }

    if (assignedTo) {
      filter.assignedTo =
        assignedTo;
    }

    const tasks =
      await Task.find(filter)
        .populate(
          "assignedTo",
          "employeeCode name phone designation department status"
        )
        .sort({
          dueDate: 1,
          createdAt: -1,
        });

    return tasks;
  };

  export const getTaskById =
  async ({
    organizationId,
    taskId,
  }) => {
    if (
      !mongoose.Types.ObjectId.isValid(
        taskId
      )
    ) {
      throw new ApiError(
        400,
        "INVALID_TASK_ID",
        "Invalid task ID."
      );
    }

    const task =
      await Task.findOne({
        _id: taskId,
        organizationId,
      })
        .populate(
          "projectId",
          "name projectCode status"
        )
        .populate(
          "assignedTo",
          "employeeCode name phone designation department status"
        );

    if (!task) {
      throw new ApiError(
        404,
        "TASK_NOT_FOUND",
        "Task not found."
      );
    }

    return task;
  };

  export const updateTask =
  async ({
    organizationId,
    userId,
    taskId,
    data,
  }) => {
    if (
      !mongoose.Types.ObjectId.isValid(
        taskId
      )
    ) {
      throw new ApiError(
        400,
        "INVALID_TASK_ID",
        "Invalid task ID."
      );
    }

    const existingTask =
      await Task.findOne({
        _id: taskId,
        organizationId,
      });

    if (!existingTask) {
      throw new ApiError(
        404,
        "TASK_NOT_FOUND",
        "Task not found."
      );
    }

    if (data.assignedTo) {
      const employee =
        await Employee.findOne({
          _id: data.assignedTo,
          organizationId,
          status: "ACTIVE",
        });

      if (!employee) {
        throw new ApiError(
          400,
          "INVALID_TASK_ASSIGNEE",
          "Employee is invalid or inactive."
        );
      }

      const project =
        await Project.findOne({
          _id: existingTask.projectId,
          organizationId,
        });

      const isProjectMember =
        project.assignedEmployees.some(
          (employeeId) =>
            employeeId.toString() ===
            data.assignedTo
        );

      if (!isProjectMember) {
        throw new ApiError(
          400,
          "EMPLOYEE_NOT_ON_PROJECT",
          "Employee is not assigned to this project."
        );
      }
    }

    const updateData = {
      ...data,
      updatedBy: userId,
    };

    if (data.dueDate) {
      updateData.dueDate =
        new Date(data.dueDate);
    }

    if (
      data.status === "COMPLETED"
    ) {
      updateData.completedAt =
        existingTask.completedAt ||
        new Date();
    }

    if (
      data.status &&
      data.status !== "COMPLETED"
    ) {
      updateData.completedAt = null;
    }

    const task =
      await Task.findOneAndUpdate(
        {
          _id: taskId,
          organizationId,
        },
        updateData,
        {
          new: true,
          runValidators: true,
        }
      )
        .populate(
          "assignedTo",
          "employeeCode name phone designation department status"
        );

    return task;
  };

  export const deleteTask =
  async ({
    organizationId,
    taskId,
  }) => {
    const task =
      await Task.findOneAndDelete({
        _id: taskId,
        organizationId,
      });

    if (!task) {
      throw new ApiError(
        404,
        "TASK_NOT_FOUND",
        "Task not found."
      );
    }

    return task;
  };