import mongoose from "mongoose";

const progressSchema = new mongoose.Schema(
  {
    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
      index: true,
    },

    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
      index: true,
    },

    milestoneId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Milestone",
      default: null,
      index: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    images: [
      {
        type: String,
        trim: true,
      },
    ],

    videos: [
      {
        type: String,
        trim: true,
      },
    ],

    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    visibleToCustomer: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

progressSchema.index({
  organizationId: 1,
  projectId: 1,
  createdAt: -1,
});

progressSchema.index({
  organizationId: 1,
  milestoneId: 1,
});

const ProjectProgress = mongoose.model(
  "ProjectProgress",
  progressSchema
);

export default ProjectProgress;