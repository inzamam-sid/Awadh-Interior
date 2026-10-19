
import { generateQuotationPdf } from "./quotation-pdf.service.js";

export const downloadQuotationPdfController = async (req, res, next) => {
  try {
    const pdfBuffer = await generateQuotationPdf({
      organizationId: req.user.organizationId,
      quotationId: req.params.id,
    });

    res.status(200);
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="quotation-${req.params.id}.pdf"`
    );
    res.setHeader("Content-Length", pdfBuffer.length);

    res.send(pdfBuffer);
  } catch (error) {
    next(error);
  }
};
