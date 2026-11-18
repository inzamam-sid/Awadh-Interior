
import PDFDocument from "pdfkit";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const letterheadPath = path.resolve(
  __dirname,
  "../../assets/awadh-letterhead.png"
);

const formatCurrency = (amount) =>
  `Rs. ${Number(amount || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const formatDate = (date) =>
  new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

// Generate Payment Receipt PDF
export const generatePaymentPdf = async (payment) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: "A4",
        margin: 40,
      });

      const chunks = [];

      doc.on("data", (chunk) => chunks.push(chunk));

      doc.on("end", () => {
        resolve(Buffer.concat(chunks));
      });

      doc.on("error", reject);

      const pageWidth = doc.page.width;
      const pageHeight = doc.page.height;

      // Add Awadh Interior letterhead
      doc.image(letterheadPath, 0, 0, {
        width: pageWidth,
        height: pageHeight,
      });

      // Receipt heading
      doc
        .font("Helvetica-Bold")
        .fontSize(20)
        .fillColor("#172B45")
        .text("PAYMENT RECEIPT", 40, 185, {
          align: "center",
        });

      // Receipt details
      doc
        .font("Helvetica")
        .fontSize(10)
        .fillColor("#222222");

      doc.text(
        `Receipt Number: ${payment.paymentNumber}`,
        45,
        235
      );

      doc.text(
        `Payment Date: ${formatDate(payment.paymentDate)}`,
        45,
        255
      );

      // Customer details
      const customer = payment.customerId;

      doc
        .font("Helvetica-Bold")
        .fontSize(11)
        .text("RECEIVED FROM:", 45, 305);

      doc
        .font("Helvetica")
        .fontSize(10)
        .text(customer?.name || "Customer", 45, 325);

      doc.text(customer?.phone || "", 45, 342);
      doc.text(customer?.email || "", 45, 359);

      // Invoice details
      const invoice = payment.invoiceId;

      doc
        .font("Helvetica-Bold")
        .fontSize(11)
        .text("INVOICE DETAILS:", 340, 305);

      doc
        .font("Helvetica")
        .fontSize(10)
        .text(
          `Invoice Number: ${invoice?.invoiceNumber || "N/A"}`,
          340,
          325
        );

      doc.text(
        `Invoice Total: ${formatCurrency(invoice?.total)}`,
        340,
        345
      );

      // Payment information box
      doc
        .roundedRect(45, 410, pageWidth - 90, 120, 8)
        .fill("#F1F4F8");

      doc
        .font("Helvetica-Bold")
        .fontSize(11)
        .fillColor("#172B45")
        .text("PAYMENT INFORMATION", 65, 430);

      doc
        .font("Helvetica")
        .fontSize(10)
        .fillColor("#222222");

      doc.text(
        `Payment Method: ${payment.paymentMethod.replaceAll("_", " ")}`,
        65,
        460
      );

      doc.text(
        `Transaction Reference: ${payment.transactionReference || "N/A"}`,
        65,
        480
      );

      doc.text(
        `Received By: ${payment.receivedBy?.name || "Staff"}`,
        65,
        500
      );

      // Amount received
      doc
        .font("Helvetica-Bold")
        .fontSize(13)
        .fillColor("#172B45")
        .text("AMOUNT RECEIVED", 45, 575);

      doc
        .font("Helvetica-Bold")
        .fontSize(24)
        .fillColor("#15803D")
        .text(formatCurrency(payment.amount), 45, 600);

      // Notes
      if (payment.notes) {
        doc
          .font("Helvetica-Bold")
          .fontSize(10)
          .fillColor("#172B45")
          .text("Notes:", 45, 665);

        doc
          .font("Helvetica")
          .fontSize(9)
          .fillColor("#222222")
          .text(payment.notes, 45, 682, {
            width: 480,
          });
      }

      // Footer message
    //   doc
    //     .font("Helvetica-Bold")
    //     .fontSize(11)
    //     .fillColor("#172B45")
    //     .text(
    //       "Thank you for choosing Awadh Interior!",
    //       45,
    //       745,
    //       {
    //         align: "center",
    //         width: pageWidth - 90,
    //       }
    //     );

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
};
