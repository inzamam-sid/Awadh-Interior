
import { getPaymentById } from "./payment.service.js";
import { generatePaymentPdf } from "./payment-pdf.service.js";

export const downloadPaymentPdfController = async (
  req,
  res,
  next
) => {
  try {
    // Get payment with customer and invoice details
    const payment = await getPaymentById({
      organizationId: req.user.organizationId,
      paymentId: req.params.id,
    });

    // Generate payment receipt PDF
    const pdfBuffer = await generatePaymentPdf(payment);

    // Send PDF as downloadable file
    res.setHeader("Content-Type", "application/pdf");

    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${payment.paymentNumber}.pdf"`
    );

    res.status(200).send(pdfBuffer);
  } catch (error) {
    next(error);
  }
};
