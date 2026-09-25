import mongoose from "mongoose";

import Project from "./project.model.js";
import Customer from "../customers/customer.model.js";
import Lead from "../leads/lead.model.js";
import Employee from "../employees/employee.model.js";

import ApiError from "../../utils/api-error.js";

export const createProject = async ({
  organizationId,
  userId,
  data,
}) => {
  const customer =
    await Customer.findOne({
      _id: data.customerId,
      organizationId,
    });

  if (!customer) {
    throw new ApiError(
      404,
      "CUSTOMER_NOT_FOUND",
      "Customer not found."
    );
  }

  if (data.leadId) {
    const lead =
      await Lead.findOne({
        _id: data.leadId,
        organizationId,
      });

    if (!lead) {
      throw new ApiError(
        404,
        "LEAD_NOT_FOUND",
        "Lead not found."
      );
    }
  }

  const existingProject =
    await Project.findOne({
      organizationId,
      projectCode:
        data.projectCode,
    });

  if (existingProject) {
    throw new ApiError(
      409,
      "PROJECT_CODE_EXISTS",
      "Project code already exists."
    );
  }

  // Validate project manager.
  if (data.projectManagerId) {
    const manager =
      await Employee.findOne({
        _id: data.projectManagerId,
        organizationId,
      });

    if (!manager) {
      throw new ApiError(
        404,
        "PROJECT_MANAGER_NOT_FOUND",
        "Project manager not found."
      );
    }

    if (manager.status !== "ACTIVE") {
      throw new ApiError(
        400,
        "PROJECT_MANAGER_NOT_ACTIVE",
        "Only active employees can be project managers."
      );
    }
  }

  // Validate project team.
  if (
    data.assignedEmployees &&
    data.assignedEmployees.length > 0
  ) {
    const employees =
      await Employee.find({
        _id: {
          $in: data.assignedEmployees,
        },
        organizationId,
        status: "ACTIVE",
      });

    if (
      employees.length !==
      data.assignedEmployees.length
    ) {
      throw new ApiError(
        400,
        "INVALID_PROJECT_TEAM",
        "One or more assigned employees are invalid or inactive."
      );
    }
  }

  const projectData = {
    ...data,
    organizationId,
    createdBy: userId,
  };

  if (data.startDate) {
    projectData.startDate =
      new Date(data.startDate);
  }

  if (data.expectedEndDate) {
    projectData.expectedEndDate =
      new Date(data.expectedEndDate);
  }

  const project =
    await Project.create(
      projectData
    );

  return project;
};

export const getProjects = async ({
  organizationId,
  page = 1,
  limit = 20,
  status,
  customerId,
  projectManagerId,
  search,
}) => {
  const filter = {
    organizationId,
  };

  if (status) {
    filter.status = status;
  }

  if (customerId) {
    filter.customerId = customerId;
  }

  if (projectManagerId) {
    filter.projectManagerId =
      projectManagerId;
  }

  if (search) {
    filter.$or = [
      {
        name: {
          $regex: search,
          $options: "i",
        },
      },
      {
        projectCode: {
          $regex: search,
          $options: "i",
        },
      },
      {
        projectType: {
          $regex: search,
          $options: "i",
        },
      },
    ];
  }

  const skip =
    (page - 1) * limit;

  const [projects, total] =
    await Promise.all([
      Project.find(filter)
        .populate(
          "customerId",
          "name phone email"
        )
        .populate(
          "projectManagerId",
          "employeeCode name designation department"
        )
        .populate(
          "assignedEmployees",
          "employeeCode name designation department status"
        )
        .sort({
          createdAt: -1,
        })
        .skip(skip)
        .limit(limit),

      Project.countDocuments(filter),
    ]);

  return {
    projects,

    pagination: {
      page,
      limit,
      total,
      totalPages:
        Math.ceil(total / limit),
    },
  };
};

export const getProjectById =
  async ({
    organizationId,
    projectId,
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
      })
        .populate(
          "customerId",
          "name phone email address"
        )
        .populate(
          "leadId",
          "name phone email status"
        )
        .populate(
          "projectManagerId",
          "employeeCode name phone designation department"
        )
        .populate(
          "assignedEmployees",
          "employeeCode name phone designation department status"
        );

    if (!project) {
      throw new ApiError(
        404,
        "PROJECT_NOT_FOUND",
        "Project not found."
      );
    }

    return project;
  };

  export const updateProject =
  async ({
    organizationId,
    userId,
    projectId,
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

    if (data.customerId) {
      const customer =
        await Customer.findOne({
          _id: data.customerId,
          organizationId,
        });

      if (!customer) {
        throw new ApiError(
          404,
          "CUSTOMER_NOT_FOUND",
          "Customer not found."
        );
      }
    }

    if (data.projectManagerId) {
      const manager =
        await Employee.findOne({
          _id: data.projectManagerId,
          organizationId,
          status: "ACTIVE",
        });

      if (!manager) {
        throw new ApiError(
          400,
          "INVALID_PROJECT_MANAGER",
          "Project manager is invalid or inactive."
        );
      }
    }

    if (
      data.assignedEmployees &&
      data.assignedEmployees.length > 0
    ) {
      const employees =
        await Employee.find({
          _id: {
            $in: data.assignedEmployees,
          },
          organizationId,
          status: "ACTIVE",
        });

      if (
        employees.length !==
        data.assignedEmployees.length
      ) {
        throw new ApiError(
          400,
          "INVALID_PROJECT_TEAM",
          "One or more assigned employees are invalid or inactive."
        );
      }
    }

    if (data.projectCode) {
      const duplicate =
        await Project.findOne({
          organizationId,
          projectCode:
            data.projectCode,
          _id: {
            $ne: projectId,
          },
        });

      if (duplicate) {
        throw new ApiError(
          409,
          "PROJECT_CODE_EXISTS",
          "Project code already exists."
        );
      }
    }

    const updateData = {
      ...data,
      updatedBy: userId,
    };

    if (data.startDate) {
      updateData.startDate =
        new Date(data.startDate);
    }

    if (data.expectedEndDate) {
      updateData.expectedEndDate =
        new Date(data.expectedEndDate);
    }

    if (data.actualEndDate) {
      updateData.actualEndDate =
        new Date(data.actualEndDate);
    }

    const project =
      await Project.findOneAndUpdate(
        {
          _id: projectId,
          organizationId,
        },
        updateData,
        {
          new: true,
          runValidators: true,
        }
      )
        .populate(
          "customerId",
          "name phone email"
        )
        .populate(
          "projectManagerId",
          "employeeCode name designation department"
        )
        .populate(
          "assignedEmployees",
          "employeeCode name designation department status"
        );

    if (!project) {
      throw new ApiError(
        404,
        "PROJECT_NOT_FOUND",
        "Project not found."
      );
    }

    return project;
  };

  export const deleteProject =
  async ({
    organizationId,
    projectId,
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
      await Project.findOneAndDelete({
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

    return project;
  };