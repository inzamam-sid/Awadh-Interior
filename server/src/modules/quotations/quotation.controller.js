
import {
  createQuotation,
  getQuotations,
  getQuotationById,
  updateQuotation,
  deleteQuotation,
  sendQuotation,
  acceptQuotation,
  rejectQuotation,
} from "./quotation.service.js";

import {
  createQuotationSchema,
  updateQuotationSchema,
} from "./quotation.validation.js";

export const createQuotationController = async (req, res, next) => {
  try {
    const data = createQuotationSchema.parse(req.body);

    const quotation = await createQuotation({
      organizationId: req.user.organizationId,
      userId: req.user.userId,
      data,
    });

    res.status(201).json({
      success: true,
      message: "Quotation created successfully.",
      data: quotation,
    });
  } catch (error) {
    next(error);
  }
};

export const getQuotationsController = async (req, res, next) => {
  try {
    const { status, customerId } = req.query;

    const quotations = await getQuotations({
      organizationId: req.user.organizationId,
      status,
      customerId,
    });

    res.status(200).json({
      success: true,
      count: quotations.length,
      data: quotations,
    });
  } catch (error) {
    next(error);
  }
};

export const getQuotationByIdController = async (req, res, next) => {
  try {
    const quotation = await getQuotationById({
      organizationId: req.user.organizationId,
      quotationId: req.params.id,
    });

    res.status(200).json({
      success: true,
      data: quotation,
    });
  } catch (error) {
    next(error);
  }
};

export const updateQuotationController = async (req, res, next) => {
  try {
    const data = updateQuotationSchema.parse(req.body);

    const quotation = await updateQuotation({
      organizationId: req.user.organizationId,
      quotationId: req.params.id,
      data,
    });

    res.status(200).json({
      success: true,
      message: "Quotation updated successfully.",
      data: quotation,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteQuotationController = async (req, res, next) => {
  try {
    await deleteQuotation({
      organizationId: req.user.organizationId,
      quotationId: req.params.id,
    });

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};



export const sendQuotationController = async (req, res, next) => {
  try {
    const quotation = await sendQuotation({
      organizationId: req.user.organizationId,
      quotationId: req.params.id,
    });

    res.status(200).json({
      success: true,
      message: "Quotation sent successfully.",
      data: quotation,
    });
  } catch (error) {
    next(error);
  }
};

export const acceptQuotationController = async (req, res, next) => {
  try {
    const quotation = await acceptQuotation({
      organizationId: req.user.organizationId,
      quotationId: req.params.id,
    });

    res.status(200).json({
      success: true,
      message: "Quotation accepted successfully.",
      data: quotation,
    });
  } catch (error) {
    next(error);
  }
};

export const rejectQuotationController = async (req, res, next) => {
  try {
    const quotation = await rejectQuotation({
      organizationId: req.user.organizationId,
      quotationId: req.params.id,
    });

    res.status(200).json({
      success: true,
      message: "Quotation rejected successfully.",
      data: quotation,
    });
  } catch (error) {
    next(error);
  }
};
