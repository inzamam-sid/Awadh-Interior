
import mongoose from "mongoose";

const quotationItemSchema = new mongoose.Schema(
  {
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 300,
    },
    category: {
      type: String,
      trim: true,
      default: "OTHER",
    },
    quantity: {
      type: Number,
      required: true,
      min: 0.01,
    },
    unit: {
      type: String,
      required: true,
      trim: true,
      default: "piece",
    },
    rate: {
      type: Number,
      required: true,
      min: 0,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { _id: true }
);

const quotationSchema = new mongoose.Schema(
  {
    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
      index: true,
    },
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
      index: true,
    },
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      default: null,
      index: true,
    },
    leadId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lead",
      default: null,
    },
    quotationNumber: {
      type: String,
      required: true,
      trim: true,
    },
    items: {
      type: [quotationItemSchema],
      required: true,
      validate: {
        validator: (items) => items.length > 0,
        message: "A quotation must contain at least one item.",
      },
    },
    subtotal: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    discount: {
      type: Number,
      default: 0,
      min: 0,
    },
    taxRate: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    taxAmount: {
      type: Number,
      default: 0,
      min: 0,
    },
    total: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    terms: {
      type: String,
      trim: true,
      maxlength: 5000,
      default: "",
    },
    validUntil: {
      type: Date,
      default: null,
    },
    status: {
      type: String,
      enum: [
        "DRAFT",
        "SENT",
        "ACCEPTED",
        "REJECTED",
        "EXPIRED",
      ],
      default: "DRAFT",
      index: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

quotationSchema.index(
  { organizationId: 1, quotationNumber: 1 },
  { unique: true }
);

quotationSchema.index({
  organizationId: 1,
  customerId: 1,
  createdAt: -1,
});

quotationSchema.index({
  organizationId: 1,
  status: 1,
  createdAt: -1,
});

const Quotation = mongoose.model("Quotation", quotationSchema);

export default Quotation;
