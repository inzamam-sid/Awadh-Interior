
import { getInvoiceById } from "./invoice.service.js";
import { generateInvoicePdf } from "./invoice-pdf.service.js";

export const downloadInvoicePdfController = async (
  req,
  res,
  next
) => {
  try {
    // Get invoice with customer and project details
    const invoice = await getInvoiceById({
      organizationId: req.user.organizationId,
      invoiceId: req.params.id,
    });

    // Generate PDF
    const pdfBuffer = await generateInvoicePdf(invoice);

    // Send PDF as downloadable file
    res.setHeader("Content-Type", "application/pdf");

    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${invoice.invoiceNumber}.pdf"`
    );

    res.status(200).send(pdfBuffer);
  } catch (error) {
    next(error);
  }
};
