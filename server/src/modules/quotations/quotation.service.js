
import mongoose from "mongoose";
import Quotation from "./quotation.model.js";
import Customer from "../customers/customer.model.js";
import Project from "../projects/project.model.js";
import ApiError from "../../utils/api-error.js";

const roundMoney = (value) =>
  Math.round((value + Number.EPSILON) * 100) / 100;

// Validate IDs before querying MongoDB.
const validateObjectId = (id, errorCode, message) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, errorCode, message);
  }
};

// Verify that the customer belongs to this organization.
const validateCustomer = async (customerId, organizationId) => {
  validateObjectId(
    customerId,
    "INVALID_CUSTOMER_ID",
    "Invalid customer ID."
  );

  const customer = await Customer.findOne({
    _id: customerId,
    organizationId,
  });

  if (!customer) {
    throw new ApiError(
      404,
      "CUSTOMER_NOT_FOUND",
      "Customer not found in this organization."
    );
  }

  return customer;
};

// Verify that the project belongs to this organization.
const validateProject = async (projectId, organizationId) => {
  if (!projectId) return null;

  validateObjectId(
    projectId,
    "INVALID_PROJECT_ID",
    "Invalid project ID."
  );

  const project = await Project.findOne({
    _id: projectId,
    organizationId,
  });

  if (!project) {
    throw new ApiError(
      404,
      "PROJECT_NOT_FOUND",
      "Project not found in this organization."
    );
  }

  return project;
};

// Calculate all monetary values on the server.
const calculateTotals = ({ items, discount = 0, taxRate = 0 }) => {
  if (!Array.isArray(items) || items.length === 0) {
    throw new ApiError(
      400,
      "QUOTATION_ITEMS_REQUIRED",
      "Add at least one quotation item."
    );
  }

  const calculatedItems = items.map((item) => {
    const quantity = Number(item.quantity);
    const rate = Number(item.rate);

    if (
      !Number.isFinite(quantity) ||
      quantity <= 0 ||
      !Number.isFinite(rate) ||
      rate < 0
    ) {
      throw new ApiError(
        400,
        "INVALID_QUOTATION_ITEM",
        "Each item must have a positive quantity and a non-negative rate."
      );
    }

    return {
      description: item.description,
      category: item.category || "OTHER",
      quantity,
      unit: item.unit || "piece",
      rate,
      amount: roundMoney(quantity * rate),
    };
  });

  const subtotal = roundMoney(
    calculatedItems.reduce((sum, item) => sum + item.amount, 0)
  );

  discount = Number(discount);
  taxRate = Number(taxRate);

  if (
    !Number.isFinite(discount) ||
    discount < 0 ||
    discount > subtotal
  ) {
    throw new ApiError(
      400,
      "INVALID_DISCOUNT",
      "Discount must be between zero and the subtotal."
    );
  }

  if (
    !Number.isFinite(taxRate) ||
    taxRate < 0 ||
    taxRate > 100
  ) {
    throw new ApiError(
      400,
      "INVALID_TAX_RATE",
      "Tax rate must be between 0 and 100."
    );
  }

  const taxableAmount = roundMoney(subtotal - discount);
  const taxAmount = roundMoney(taxableAmount * taxRate / 100);
  const total = roundMoney(taxableAmount + taxAmount);

  return {
    items: calculatedItems,
    subtotal,
    discount,
    taxRate,
    taxAmount,
    total,
  };
};

// Generate a unique quotation number.
const generateQuotationNumber = async (organizationId) => {
  const year = new Date().getFullYear();

  for (let attempt = 0; attempt < 10; attempt++) {
    const sequence = await Quotation.countDocuments({
      organizationId,
      quotationNumber: {
        $regex: `^AI-QTN-${year}-`,
      },
    });

    const quotationNumber =
      `AI-QTN-${year}-${String(sequence + 1 + attempt).padStart(4, "0")}`;

    const exists = await Quotation.exists({
      organizationId,
      quotationNumber,
    });

    if (!exists) return quotationNumber;
  }

  throw new ApiError(
    500,
    "QUOTATION_NUMBER_GENERATION_FAILED",
    "Could not generate a quotation number. Please try again."
  );
};

// Create a new quotation.
export const createQuotation = async ({
  organizationId,
  userId,
  data,
}) => {
  if (data.leadId) {
    throw new ApiError(
      400,
      "LEAD_LINK_NOT_AVAILABLE",
      "Lead linking will be enabled when the Leads module is implemented."
    );
  }

  await validateCustomer(data.customerId, organizationId);
  await validateProject(data.projectId, organizationId);

  const totals = calculateTotals(data);
  const quotationNumber =
    await generateQuotationNumber(organizationId);

  const quotation = await Quotation.create({
    organizationId,
    customerId: data.customerId,
    projectId: data.projectId || null,
    quotationNumber,
    ...totals,
    terms: data.terms || "",
    validUntil: data.validUntil || null,
    status: "DRAFT",
    createdBy: userId,
  });

  return quotation;
};

// List quotations belonging to this organization.
export const getQuotations = async ({
  organizationId,
  status,
  customerId,
}) => {
  const filter = { organizationId };

  if (status) filter.status = status;

  if (customerId) {
    validateObjectId(
      customerId,
      "INVALID_CUSTOMER_ID",
      "Invalid customer ID."
    );
    filter.customerId = customerId;
  }

  return Quotation.find(filter)
    .populate("customerId")
    .populate("projectId", "name projectCode")
    .populate("createdBy", "name email")
    .sort({ createdAt: -1 });
};

// Get one quotation.
export const getQuotationById = async ({
  organizationId,
  quotationId,
}) => {
  validateObjectId(
    quotationId,
    "INVALID_QUOTATION_ID",
    "Invalid quotation ID."
  );

  const quotation = await Quotation.findOne({
    _id: quotationId,
    organizationId,
  })
    .populate("customerId")
    .populate("projectId", "name projectCode")
    .populate("createdBy", "name email");

  if (!quotation) {
    throw new ApiError(
      404,
      "QUOTATION_NOT_FOUND",
      "Quotation not found."
    );
  }

  return quotation;
};

// Update a draft quotation.
export const updateQuotation = async ({
  organizationId,
  quotationId,
  data,
}) => {
  validateObjectId(
    quotationId,
    "INVALID_QUOTATION_ID",
    "Invalid quotation ID."
  );

  if (data.leadId) {
    throw new ApiError(
      400,
      "LEAD_LINK_NOT_AVAILABLE",
      "Lead linking will be enabled when the Leads module is implemented."
    );
  }

  const quotation = await Quotation.findOne({
    _id: quotationId,
    organizationId,
  });

  if (!quotation) {
    throw new ApiError(
      404,
      "QUOTATION_NOT_FOUND",
      "Quotation not found."
    );
  }

  if (quotation.status !== "DRAFT") {
    throw new ApiError(
      409,
      "QUOTATION_NOT_EDITABLE",
      "Only draft quotations can be edited."
    );
  }

  if (data.customerId) {
    await validateCustomer(data.customerId, organizationId);
  }

  if (data.projectId !== undefined) {
    await validateProject(data.projectId, organizationId);
  }

  const nextItems = data.items ?? quotation.items;
  const nextDiscount = data.discount ?? quotation.discount;
  const nextTaxRate = data.taxRate ?? quotation.taxRate;

  const totals = calculateTotals({
    items: nextItems,
    discount: nextDiscount,
    taxRate: nextTaxRate,
  });

  const updateData = {
    ...totals,
  };

  if (data.customerId !== undefined) {
    updateData.customerId = data.customerId;
  }

  if (data.projectId !== undefined) {
    updateData.projectId = data.projectId || null;
  }

  if (data.terms !== undefined) {
    updateData.terms = data.terms;
  }

  if (data.validUntil !== undefined) {
    updateData.validUntil = data.validUntil;
  }

  const updatedQuotation = await Quotation.findOneAndUpdate(
    { _id: quotationId, organizationId, status: "DRAFT" },
    updateData,
    { new: true, runValidators: true }
  )
    .populate("customerId")
    .populate("projectId", "name projectCode")
    .populate("createdBy", "name email");

  if (!updatedQuotation) {
    throw new ApiError(
      409,
      "QUOTATION_UPDATE_CONFLICT",
      "The quotation could not be updated. Please reload and try again."
    );
  }

  return updatedQuotation;
};

// Delete draft quotations only.
export const deleteQuotation = async ({
  organizationId,
  quotationId,
}) => {
  validateObjectId(
    quotationId,
    "INVALID_QUOTATION_ID",
    "Invalid quotation ID."
  );

  const quotation = await Quotation.findOne({
    _id: quotationId,
    organizationId,
  });

  if (!quotation) {
    throw new ApiError(
      404,
      "QUOTATION_NOT_FOUND",
      "Quotation not found."
    );
  }

  if (quotation.status !== "DRAFT") {
    throw new ApiError(
      409,
      "QUOTATION_NOT_DELETABLE",
      "Only draft quotations can be deleted."
    );
  }

  await Quotation.deleteOne({
    _id: quotationId,
    organizationId,
    status: "DRAFT",
  });

  return quotation;
};



const transitionQuotationStatus = async ({
  organizationId,
  quotationId,
  allowedStatuses,
  nextStatus,
}) => {
  validateObjectId(
    quotationId,
    "INVALID_QUOTATION_ID",
    "Invalid quotation ID."
  );

  const quotation = await Quotation.findOne({
    _id: quotationId,
    organizationId,
  });

  if (!quotation) {
    throw new ApiError(
      404,
      "QUOTATION_NOT_FOUND",
      "Quotation not found."
    );
  }

  // Expire overdue quotations before allowing a transition.
  if (
    quotation.status === "SENT" &&
    quotation.validUntil &&
    quotation.validUntil.getTime() < Date.now()
  ) {
    await Quotation.updateOne(
      { _id: quotationId, organizationId, status: "SENT" },
      { $set: { status: "EXPIRED" } }
    );

    throw new ApiError(
      409,
      "QUOTATION_EXPIRED",
      "This quotation has expired and cannot be accepted or rejected."
    );
  }

  if (!allowedStatuses.includes(quotation.status)) {
    throw new ApiError(
      409,
      "INVALID_QUOTATION_STATUS",
      `Cannot change quotation from ${quotation.status} to ${nextStatus}.`
    );
  }

  const updatedQuotation = await Quotation.findOneAndUpdate(
    {
      _id: quotationId,
      organizationId,
      status: { $in: allowedStatuses },
    },
    { $set: { status: nextStatus } },
    { new: true, runValidators: true }
  )
    .populate("customerId")
    .populate("projectId", "name projectCode")
    .populate("createdBy", "name email");

  if (!updatedQuotation) {
    throw new ApiError(
      409,
      "QUOTATION_STATUS_CONFLICT",
      "The quotation status changed. Reload and try again."
    );
  }

  return updatedQuotation;
};

export const sendQuotation = async ({ organizationId, quotationId }) => {
  return transitionQuotationStatus({
    organizationId,
    quotationId,
    allowedStatuses: ["DRAFT"],
    nextStatus: "SENT",
  });
};

export const acceptQuotation = async ({ organizationId, quotationId }) => {
  return transitionQuotationStatus({
    organizationId,
    quotationId,
    allowedStatuses: ["SENT"],
    nextStatus: "ACCEPTED",
  });
};

export const rejectQuotation = async ({ organizationId, quotationId }) => {
  return transitionQuotationStatus({
    organizationId,
    quotationId,
    allowedStatuses: ["SENT"],
    nextStatus: "REJECTED",
  });
};
