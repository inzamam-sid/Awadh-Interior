
import {
  createInvoice,
  getInvoices,
  getInvoiceById,
} from "./invoice.service.js";

export const createInvoiceController = async (req, res) => {
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
};


export const getInvoicesController = async (req, res) => {
  const invoices = await getInvoices({
    organizationId: req.user.organizationId,
    status: req.query.status,
    customerId: req.query.customerId,
  });

  res.status(200).json({
    success: true,
    data: invoices,
  });
};


export const getInvoiceByIdController = async (req, res) => {
  const invoice = await getInvoiceById({
    organizationId: req.user.organizationId,
    invoiceId: req.params.id,
  });

  res.status(200).json({
    success: true,
    data: invoice,
  });
};
