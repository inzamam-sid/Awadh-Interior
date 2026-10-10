import mongoose from "mongoose";

import ProjectProgress from "./progress.model.js";
import Project from "../projects/project.model.js";
import Milestone from "../milestones/milestone.model.js";

import ApiError from "../../utils/api-error.js";

export const createProgress = async ({
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

  if (data.milestoneId) {
    if (
      !mongoose.Types.ObjectId.isValid(
        data.milestoneId
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
        _id: data.milestoneId,
        projectId,
        organizationId,
      });

    if (!milestone) {
      throw new ApiError(
        404,
        "MILESTONE_NOT_FOUND",
        "Milestone does not belong to this project."
      );
    }
  }

  const progress =
    await ProjectProgress.create({
      ...data,
      organizationId,
      projectId,
      uploadedBy: userId,
    });

  return progress;
};

export const getProjectProgress =
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

    const progress =
      await ProjectProgress.find({
        organizationId,
        projectId,
      })
        .populate(
          "milestoneId",
          "title order status"
        )
        .populate(
          "uploadedBy",
          "name email role"
        )
        .sort({
          createdAt: -1,
        });

    return progress;
  };

  export const getProgressById =
  async ({
    organizationId,
    progressId,
  }) => {
    if (
      !mongoose.Types.ObjectId.isValid(
        progressId
      )
    ) {
      throw new ApiError(
        400,
        "INVALID_PROGRESS_ID",
        "Invalid progress ID."
      );
    }

    const progress =
      await ProjectProgress.findOne({
        _id: progressId,
        organizationId,
      })
        .populate(
          "projectId",
          "name projectCode"
        )
        .populate(
          "milestoneId",
          "title order status"
        )
        .populate(
          "uploadedBy",
          "name email role"
        );

    if (!progress) {
      throw new ApiError(
        404,
        "PROGRESS_NOT_FOUND",
        "Progress update not found."
      );
    }

    return progress;
  };

  export const updateProgress =
  async ({
    organizationId,
    progressId,
    data,
  }) => {
    if (
      !mongoose.Types.ObjectId.isValid(
        progressId
      )
    ) {
      throw new ApiError(
        400,
        "INVALID_PROGRESS_ID",
        "Invalid progress ID."
      );
    }

    const existingProgress =
      await ProjectProgress.findOne({
        _id: progressId,
        organizationId,
      });

    if (!existingProgress) {
      throw new ApiError(
        404,
        "PROGRESS_NOT_FOUND",
        "Progress update not found."
      );
    }

    const updateData = {
      ...data,
    };

    const progress =
      await ProjectProgress.findOneAndUpdate(
        {
          _id: progressId,
          organizationId,
        },
        updateData,
        {
          new: true,
          runValidators: true,
        }
      )
        .populate(
          "milestoneId",
          "title order status"
        )
        .populate(
          "uploadedBy",
          "name email role"
        );

    return progress;
  };

  export const deleteProgress =
    async ({
        organizationId,
        progressId,
    }) => {
        const progress =
        await ProjectProgress.findOneAndDelete({
            _id: progressId,
            organizationId,
        });

        if (!progress) {
        throw new ApiError(
            404,
            "PROGRESS_NOT_FOUND",
            "Progress update not found."
        );
        }

        return progress;
  };