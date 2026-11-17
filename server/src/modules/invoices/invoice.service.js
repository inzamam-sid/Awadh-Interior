
import mongoose from "mongoose";

import Invoice from "./invoice.model.js";
import Quotation from "../quotations/quotation.model.js";

import Customer from "../customers/customer.model.js";
import Project from "../projects/project.model.js";

import ApiError from "../../utils/api-error.js";

// Round money to 2 decimal places
const roundMoney = (value) =>
  Math.round((value + Number.EPSILON) * 100) / 100;


// Validate MongoDB ObjectId
const validateObjectId = (id, errorCode, message) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, errorCode, message);
  }
};


// Generate unique invoice number
const generateInvoiceNumber = async (organizationId) => {
  const year = new Date().getFullYear();

  for (let attempt = 0; attempt < 10; attempt++) {
    const sequence = await Invoice.countDocuments({
      organizationId,
      invoiceNumber: {
        $regex: `^AI-INV-${year}-`,
      },
    });

    const invoiceNumber =
      `AI-INV-${year}-${String(sequence + 1 + attempt).padStart(4, "0")}`;

    const exists = await Invoice.exists({
      organizationId,
      invoiceNumber,
    });

    if (!exists) return invoiceNumber;
  }

  throw new ApiError(
    500,
    "INVOICE_NUMBER_GENERATION_FAILED",
    "Could not generate an invoice number. Please try again."
  );
};


// Create invoice from an accepted quotation
export const createInvoice = async ({
  organizationId,
  userId,
  data,
}) => {
  validateObjectId(
    data.quotationId,
    "INVALID_QUOTATION_ID",
    "Invalid quotation ID."
  );

  // Find accepted quotation
  const quotation = await Quotation.findOne({
    _id: data.quotationId,
    organizationId,
  });

  if (!quotation) {
    throw new ApiError(
      404,
      "QUOTATION_NOT_FOUND",
      "Quotation not found."
    );
  }

  // Only accepted quotations can generate invoices
  if (quotation.status !== "ACCEPTED") {
    throw new ApiError(
      409,
      "QUOTATION_NOT_ACCEPTED",
      "Only accepted quotations can generate invoices."
    );
  }

  // Check customer
  const customer = await Customer.findOne({
    _id: quotation.customerId,
    organizationId,
  });

  if (!customer) {
    throw new ApiError(
      404,
      "CUSTOMER_NOT_FOUND",
      "Customer not found."
    );
  }

  // Check project if available
  if (quotation.projectId) {
    const project = await Project.findOne({
      _id: quotation.projectId,
      organizationId,
    });

    if (!project) {
      throw new ApiError(
        404,
        "PROJECT_NOT_FOUND",
        "Project not found."
      );
    }
  }

  // Prevent duplicate invoices
  const existingInvoice = await Invoice.findOne({
    organizationId,
    quotationId: quotation._id,
  });

  if (existingInvoice) {
    throw new ApiError(
      409,
      "INVOICE_ALREADY_EXISTS",
      "An invoice already exists for this quotation."
    );
  }

  // Generate invoice number
  const invoiceNumber =
    await generateInvoiceNumber(organizationId);

  // Copy financial details from accepted quotation
  const subtotal = roundMoney(quotation.subtotal);
  const discount = roundMoney(quotation.discount);
  const taxRate = Number(quotation.taxRate);
  const taxAmount = roundMoney(quotation.taxAmount);
  const total = roundMoney(quotation.total);

  // Initial payment values
  const amountPaid = 0;
  const balanceDue = total;

  try {
    const invoice = await Invoice.create({
      organizationId,
      quotationId: quotation._id,
      customerId: quotation.customerId,
      projectId: quotation.projectId || null,

      invoiceNumber,

      items: quotation.items.map((item) => ({
        description: item.description,
        category: item.category,
        quantity: item.quantity,
        unit: item.unit,
        rate: item.rate,
        amount: item.amount,
      })),

      subtotal,
      discount,
      taxRate,
      taxAmount,
      total,

      amountPaid,
      balanceDue,

      dueDate: data.dueDate,

      status: "DRAFT",

      notes: data.notes || "",

      createdBy: userId,
    });

    return invoice;
  } catch (error) {
    // Handle duplicate quotation invoice
    if (error.code === 11000) {
      throw new ApiError(
        409,
        "INVOICE_ALREADY_EXISTS",
        "An invoice already exists for this quotation."
      );
    }

    throw error;
  }
};


// Get all invoices belonging to organization
export const getInvoices = async ({
  organizationId,
  status,
  customerId,
}) => {
  const filter = { organizationId };

  if (status) {
    filter.status = status;
  }

  if (customerId) {
    validateObjectId(
      customerId,
      "INVALID_CUSTOMER_ID",
      "Invalid customer ID."
    );

    filter.customerId = customerId;
  }

  return Invoice.find(filter)
    .populate("customerId")
    .populate("quotationId", "quotationNumber")
    .populate("projectId", "name projectCode")
    .populate("createdBy", "name email")
    .sort({ createdAt: -1 });
};


// Get one invoice
export const getInvoiceById = async ({
  organizationId,
  invoiceId,
}) => {
  validateObjectId(
    invoiceId,
    "INVALID_INVOICE_ID",
    "Invalid invoice ID."
  );

  const invoice = await Invoice.findOne({
    _id: invoiceId,
    organizationId,
  })
    .populate("customerId")
    .populate("quotationId", "quotationNumber")
    .populate("projectId", "name projectCode")
    .populate("createdBy", "name email");

  if (!invoice) {
    throw new ApiError(
      404,
      "INVOICE_NOT_FOUND",
      "Invoice not found."
    );
  }

  return invoice;
};
