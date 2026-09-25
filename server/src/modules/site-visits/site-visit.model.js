import mongoose from "mongoose";

const siteVisitSchema = new mongoose.Schema(
  {
    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
      index: true,
    },

    leadId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lead",
      default: null,
      index: true,
    },

    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      default: null,
      index: true,
    },

    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      default: null,
      index: true,
    },

    scheduledAt: {
      type: Date,
      required: true,
      index: true,
    },

    address: {
      street: {
        type: String,
        default: "",
        trim: true,
      },

      city: {
        type: String,
        default: "",
        trim: true,
      },

      state: {
        type: String,
        default: "",
        trim: true,
      },

      pincode: {
        type: String,
        default: "",
        trim: true,
      },

      landmark: {
        type: String,
        default: "",
        trim: true,
      },
    },

    status: {
      type: String,
      enum: [
        "SCHEDULED",
        "CONFIRMED",
        "COMPLETED",
        "CANCELLED",
        "RESCHEDULED",
      ],
      default: "SCHEDULED",
      index: true,
    },

    notes: {
      type: String,
      default: "",
      trim: true,
    },

    findings: {
      type: String,
      default: "",
      trim: true,
    },

    nextAction: {
      type: String,
      default: "",
      trim: true,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
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

siteVisitSchema.index({
  organizationId: 1,
  scheduledAt: 1,
});

siteVisitSchema.index({
  organizationId: 1,
  status: 1,
});

siteVisitSchema.index({
  organizationId: 1,
  assignedTo: 1,
});

const SiteVisit = mongoose.model(
  "SiteVisit",
  siteVisitSchema
);

export default SiteVisit;