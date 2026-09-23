import mongoose from "mongoose";

const leadSchema = new mongoose.Schema(
  {
    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
      index: true,
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

    source: {
      type: String,
      enum: [
        "WEBSITE",
        "WHATSAPP",
        "PHONE",
        "INSTAGRAM",
        "FACEBOOK",
        "REFERRAL",
        "WALK_IN",
        "OTHER",
      ],
      default: "OTHER",
    },

    status: {
      type: String,
      enum: [
        "NEW",
        "CONTACTED",
        "QUALIFIED",
        "SITE_VISIT",
        "QUOTATION",
        "NEGOTIATION",
        "WON",
        "LOST",
      ],
      default: "NEW",
      index: true,
    },

    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
      index: true,
    },

    requirement: {
      projectType: {
        type: String,
        default: "",
        trim: true,
      },

      roomType: {
        type: String,
        default: "",
        trim: true,
      },

      ceilingType: {
        type: String,
        default: "",
        trim: true,
      },

      designStyle: {
        type: String,
        default: "",
        trim: true,
      },

      area: {
        type: Number,
        default: null,
        min: 0,
      },

      lighting: {
        type: String,
        default: "",
        trim: true,
      },

      description: {
        type: String,
        default: "",
        trim: true,
      },
    },

    budget: {
      min: {
        type: Number,
        default: null,
        min: 0,
      },

      max: {
        type: Number,
        default: null,
        min: 0,
      },
    },

    property: {
      type: {
        type: String,
        default: "",
        trim: true,
      },

      address: {
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
    },

    notes: {
      type: String,
      default: "",
      trim: true,
    },

    followUps: [
      {
        date: {
          type: Date,
          required: true,
        },

        note: {
          type: String,
          required: true,
          trim: true,
        },

        completed: {
          type: Boolean,
          default: false,
        },

        completedAt: {
          type: Date,
          default: null,
        },
      },
    ],

    convertedCustomerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      default: null,
    },

    lostReason: {
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

leadSchema.index({
  organizationId: 1,
  status: 1,
});

leadSchema.index({
  organizationId: 1,
  assignedTo: 1,
});

leadSchema.index({
  organizationId: 1,
  createdAt: -1,
});

leadSchema.index({
  organizationId: 1,
  phone: 1,
});

const Lead = mongoose.model("Lead", leadSchema);

export default Lead;