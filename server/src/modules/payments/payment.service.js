
import mongoose from "mongoose";
import Payment from "./payment.model.js";
import Invoice from "../invoices/invoice.model.js";
import Customer from "../customers/customer.model.js";
import ApiError from "../../utils/api-error.js";

// Generate payment receipt number
const generatePaymentNumber = async (organizationId) => {
  const year = new Date().getFullYear();

  const count = await Payment.countDocuments({
    organizationId,
    paymentNumber: {
      $regex: `^AI-PAY-${year}-`,
    },
  });

  return `AI-PAY-${year}-${String(count + 1).padStart(4, "0")}`;
};

// Record a new payment
export const createPayment = async ({
  organizationId,
  userId,
  data,
}) => {
  if (!mongoose.Types.ObjectId.isValid(data.invoiceId)) {
    throw new ApiError(
      400,
      "INVALID_INVOICE_ID",
      "Invalid invoice ID."
    );
  }

  // Find invoice belonging to this organization
  const invoice = await Invoice.findOne({
    _id: data.invoiceId,
    organizationId,
  });

  if (!invoice) {
    throw new ApiError(
      404,
      "INVOICE_NOT_FOUND",
      "Invoice not found."
    );
  }

  // Only issued invoices can receive payments
  if (invoice.status === "DRAFT") {
    throw new ApiError(
      409,
      "INVOICE_NOT_ISSUED",
      "Please issue the invoice before recording a payment."
    );
  }

  if (invoice.balanceDue <= 0) {
    throw new ApiError(
      409,
      "INVOICE_ALREADY_PAID",
      "This invoice has already been fully paid."
    );
  }

  // Prevent overpayment
  if (data.amount > invoice.balanceDue) {
    throw new ApiError(
      400,
      "PAYMENT_EXCEEDS_BALANCE",
      `Maximum payable amount is ${invoice.balanceDue}.`
    );
  }

  const customer = await Customer.findOne({
    _id: invoice.customerId,
    organizationId,
  });

  if (!customer) {
    throw new ApiError(
      404,
      "CUSTOMER_NOT_FOUND",
      "Customer not found."
    );
  }

  const paymentNumber = await generatePaymentNumber(organizationId);

  // Create payment record
  const payment = await Payment.create({
    organizationId,
    invoiceId: invoice._id,
    customerId: invoice.customerId,
    paymentNumber,
    amount: data.amount,
    paymentMethod: data.paymentMethod,
    paymentDate: data.paymentDate,
    transactionReference: data.transactionReference,
    notes: data.notes,
    receivedBy: userId,
  });

  // Update invoice balance
  invoice.amountPaid += data.amount;
  invoice.balanceDue -= data.amount;

  if (invoice.balanceDue <= 0) {
    invoice.balanceDue = 0;
    invoice.status = "PAID";
  } else {
    invoice.status = "PARTIALLY_PAID";
  }

  try {
    await invoice.save();
  } catch (error) {
    // Remove payment if invoice update fails
    await Payment.deleteOne({ _id: payment._id });
    throw error;
  }

  return payment;
};

// Get all payments

export const getPayments = async ({
  organizationId,
  invoiceId,
  customerId,
}) => {
  const filter = { organizationId };

  if (invoiceId) {
    filter.invoiceId = invoiceId;
  }

  if (customerId) {
    filter.customerId = customerId;
  }

  return Payment.find(filter)
    .populate("invoiceId", "invoiceNumber total")
    .populate("customerId", "name phone email")
    .populate("receivedBy", "name email")
    .sort({ paymentDate: -1 });
};


// Get payment by ID
export const getPaymentById = async ({
  organizationId,
  paymentId,
}) => {
  if (!mongoose.Types.ObjectId.isValid(paymentId)) {
    throw new ApiError(
      400,
      "INVALID_PAYMENT_ID",
      "Invalid payment ID."
    );
  }

  const payment = await Payment.findOne({
    _id: paymentId,
    organizationId,
  })
    .populate("invoiceId", "invoiceNumber total")
    .populate("customerId", "name phone")
    .populate("receivedBy", "name email");

  if (!payment) {
    throw new ApiError(
      404,
      "PAYMENT_NOT_FOUND",
      "Payment not found."
    );
  }

  return payment;
};
