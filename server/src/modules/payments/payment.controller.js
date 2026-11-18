
import {
  createPayment,
  getPayments,
  getPaymentById,
} from "./payment.service.js";

// Create payment
export const createPaymentController = async (req, res, next) => {
  try {
    const payment = await createPayment({
      organizationId: req.user.organizationId,
      userId: req.user.userId,
      data: req.body,
    });

    res.status(201).json({
      success: true,
      message: "Payment recorded successfully.",
      data: payment,
    });
  } catch (error) {
    next(error);
  }
};

// Get all payments
export const getPaymentsController = async (req, res, next) => {
  try {
    const payments = await getPayments({
      organizationId: req.user.organizationId,
      invoiceId: req.query.invoiceId,
    });

    res.status(200).json({
      success: true,
      data: payments,
    });
  } catch (error) {
    next(error);
  }
};

// Get payment by ID
export const getPaymentByIdController = async (req, res, next) => {
  try {
    const payment = await getPaymentById({
      organizationId: req.user.organizationId,
      paymentId: req.params.id,
    });

    res.status(200).json({
      success: true,
      data: payment,
    });
  } catch (error) {
    next(error);
  }
};
