import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema(
  {
    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
      index: true,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
      index: true,
    },

    employeeCode: {
      type: String,
      required: true,
      trim: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      lowercase: true,
      trim: true,
      default: "",
    },

    designation: {
      type: String,
      required: true,
      trim: true,
    },

    department: {
      type: String,
      default: "",
      trim: true,
    },

    skills: {
      type: [String],
      default: [],
    },

    joiningDate: {
      type: Date,
      default: null,
    },

    salary: {
      type: Number,
      default: null,
      min: 0,
    },

    emergencyContact: {
      name: {
        type: String,
        default: "",
        trim: true,
      },

      phone: {
        type: String,
        default: "",
        trim: true,
      },

      relationship: {
        type: String,
        default: "",
        trim: true,
      },
    },

    status: {
      type: String,
      enum: [
        "ACTIVE",
        "INACTIVE",
        "ON_LEAVE",
      ],
      default: "ACTIVE",
      index: true,
    },

    notes: {
      type: String,
      default: "",
      trim: true,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
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

employeeSchema.index({
  organizationId: 1,
  employeeCode: 1,
});

employeeSchema.index({
  organizationId: 1,
  status: 1,
});

employeeSchema.index({
  organizationId: 1,
  name: 1,
});

const Employee = mongoose.model(
  "Employee",
  employeeSchema
);

export default Employee;