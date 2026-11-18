
import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
      index: true,
    },

    invoiceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Invoice",
      required: true,
    },

    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },

    paymentNumber: {
      type: String,
      required: true,
    },

    amount: {
      type: Number,
      required: true,
      min: 0.01,
    },

    paymentMethod: {
      type: String,
      enum: ["CASH", "UPI", "BANK_TRANSFER", "CHEQUE"],
      required: true,
    },

    paymentDate: {
      type: Date,
      default: Date.now,
    },

    transactionReference: {
      type: String,
      default: "",
    },

    notes: {
      type: String,
      default: "",
    },

    receivedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Payment number must be unique within an organization
paymentSchema.index(
  { organizationId: 1, paymentNumber: 1 },
  { unique: true }
);

const Payment = mongoose.model("Payment", paymentSchema);

export default Payment;
