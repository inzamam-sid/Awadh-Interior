import mongoose from "mongoose";

const organizationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    logo: {
      type: String,
      default: null,
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    contact: {
      phone: {
        type: String,
        default: "",
      },

      email: {
        type: String,
        default: "",
      },
    },

    address: {
      street: {
        type: String,
        default: "",
      },

      city: {
        type: String,
        default: "",
      },

      state: {
        type: String,
        default: "",
      },

      pincode: {
        type: String,
        default: "",
      },

      country: {
        type: String,
        default: "India",
      },
    },

    serviceAreas: {
      type: [String],
      default: [],
    },

    businessHours: {
      type: Object,
      default: {},
    },

    socialLinks: {
      type: Object,
      default: {},
    },

    settings: {
      type: Object,
      default: {},
    },

    subscription: {
      plan: {
        type: String,
        default: "FREE",
      },

      status: {
        type: String,
        default: "ACTIVE",
      },
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Organization = mongoose.model(
  "Organization",
  organizationSchema
);

export default Organization;