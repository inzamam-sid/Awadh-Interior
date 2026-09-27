import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
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

    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      default: null,
      index: true,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    priority: {
      type: String,
      enum: [
        "LOW",
        "MEDIUM",
        "HIGH",
        "URGENT",
      ],
      default: "MEDIUM",
      index: true,
    },

    status: {
      type: String,
      enum: [
        "TODO",
        "IN_PROGRESS",
        "COMPLETED",
        "CANCELLED",
      ],
      default: "TODO",
      index: true,
    },

    dueDate: {
      type: Date,
      default: null,
      index: true,
    },

    completedAt: {
      type: Date,
      default: null,
    },

    notes: {
      type: String,
      default: "",
      trim: true,
    },

    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

taskSchema.index({
  organizationId: 1,
  projectId: 1,
});

taskSchema.index({
  organizationId: 1,
  projectId: 1,
  status: 1,
});

taskSchema.index({
  organizationId: 1,
  assignedTo: 1,
});

const Task = mongoose.model(
  "Task",
  taskSchema
);

export default Task;