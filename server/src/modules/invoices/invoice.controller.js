
import {
  createInvoice,
  getInvoices,
  getInvoiceById,
  updateInvoice,
} from "./invoice.service.js";

// Create invoice
export const createInvoiceController = async (req, res, next) => {
  try {
    const invoice = await createInvoice({
      organizationId: req.user.organizationId,
      userId: req.user.userId,
      data: req.body,
    });

    res.status(201).json({
      success: true,
      message: "Invoice created successfully.",
      data: invoice,
    });
  } catch (error) {
    next(error);
  }
};

// Get all invoices
export const getInvoicesController = async (req, res, next) => {
  try {
    const invoices = await getInvoices({
      organizationId: req.user.organizationId,
      status: req.query.status,
      customerId: req.query.customerId,
    });

    res.status(200).json({
      success: true,
      data: invoices,
    });
  } catch (error) {
    next(error);
  }
};

// Get invoice by ID
export const getInvoiceByIdController = async (req, res, next) => {
  try {
    const invoice = await getInvoiceById({
      organizationId: req.user.organizationId,
      invoiceId: req.params.id,
    });

    res.status(200).json({
      success: true,
      data: invoice,
    });
  } catch (error) {
    next(error);
  }
};

// Update invoice
export const updateInvoiceController = async (req, res, next) => {
  try {
    const invoice = await updateInvoice({
      organizationId: req.user.organizationId,
      invoiceId: req.params.id,
      data: req.body,
    });

    res.status(200).json({
      success: true,
      message: "Invoice updated successfully.",
      data: invoice,
    });
  } catch (error) {
    next(error);
  }
};
