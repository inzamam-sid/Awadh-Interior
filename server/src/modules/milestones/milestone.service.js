import mongoose from "mongoose";

import Milestone from "./milestone.model.js";
import Project from "../projects/project.model.js";

import ApiError from "../../utils/api-error.js";

export const createMilestone = async ({
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

  const existingOrder =
    await Milestone.findOne({
      organizationId,
      projectId,
      order: data.order,
    });

  if (existingOrder) {
    throw new ApiError(
      409,
      "MILESTONE_ORDER_EXISTS",
      "A milestone with this order already exists."
    );
  }

  const milestoneData = {
    ...data,
    organizationId,
    projectId,
    createdBy: userId,
  };

  if (data.startDate) {
    milestoneData.startDate =
      new Date(data.startDate);
  }

  if (data.dueDate) {
    milestoneData.dueDate =
      new Date(data.dueDate);
  }

  if (data.status === "COMPLETED") {
    milestoneData.completedAt =
      new Date();
  }

  const milestone =
    await Milestone.create(
      milestoneData
    );

  return milestone;
};

export const getProjectMilestones =
  async ({
    organizationId,
    projectId,
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

    const milestones =
      await Milestone.find({
        organizationId,
        projectId,
      }).sort({
        order: 1,
      });

    return milestones;
  };

  export const getMilestoneById =
  async ({
    organizationId,
    milestoneId,
  }) => {
    if (
      !mongoose.Types.ObjectId.isValid(
        milestoneId
      )
    ) {
      throw new ApiError(
        400,
        "INVALID_MILESTONE_ID",
        "Invalid milestone ID."
      );
    }

    const milestone =
      await Milestone.findOne({
        _id: milestoneId,
        organizationId,
      }).populate(
        "projectId",
        "name projectCode status"
      );

    if (!milestone) {
      throw new ApiError(
        404,
        "MILESTONE_NOT_FOUND",
        "Milestone not found."
      );
    }

    return milestone;
  };

  export const updateMilestone =
  async ({
    organizationId,
    userId,
    milestoneId,
    data,
  }) => {
    if (
      !mongoose.Types.ObjectId.isValid(
        milestoneId
      )
    ) {
      throw new ApiError(
        400,
        "INVALID_MILESTONE_ID",
        "Invalid milestone ID."
      );
    }

    const existingMilestone =
      await Milestone.findOne({
        _id: milestoneId,
        organizationId,
      });

    if (!existingMilestone) {
      throw new ApiError(
        404,
        "MILESTONE_NOT_FOUND",
        "Milestone not found."
      );
    }

    if (
      data.order !== undefined &&
      data.order !== existingMilestone.order
    ) {
      const duplicate =
        await Milestone.findOne({
          organizationId,
          projectId:
            existingMilestone.projectId,
          order: data.order,
          _id: {
            $ne: milestoneId,
          },
        });

      if (duplicate) {
        throw new ApiError(
          409,
          "MILESTONE_ORDER_EXISTS",
          "A milestone with this order already exists."
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

    if (data.dueDate) {
      updateData.dueDate =
        new Date(data.dueDate);
    }

    if (
      data.status === "COMPLETED"
    ) {
      updateData.completedAt =
        existingMilestone.completedAt ||
        new Date();
    }

    if (
      data.status &&
      data.status !== "COMPLETED"
    ) {
      updateData.completedAt = null;
    }

    const milestone =
      await Milestone.findOneAndUpdate(
        {
          _id: milestoneId,
          organizationId,
        },
        updateData,
        {
          new: true,
          runValidators: true,
        }
      );

    return milestone;
  };

  export const deleteMilestone =
  async ({
    organizationId,
    milestoneId,
  }) => {
    const milestone =
      await Milestone.findOneAndDelete({
        _id: milestoneId,
        organizationId,
      });

    if (!milestone) {
      throw new ApiError(
        404,
        "MILESTONE_NOT_FOUND",
        "Milestone not found."
      );
    }

    return milestone;
  };