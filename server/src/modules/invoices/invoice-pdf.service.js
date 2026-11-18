
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

// Generate Invoice PDF
export const generateInvoicePdf = async (invoice) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: "A4",
        margin: 40,
        bufferPages: true,
      });

      const chunks = [];

      doc.on("data", (chunk) => chunks.push(chunk));

      doc.on("end", () => {
        resolve(Buffer.concat(chunks));
      });

      doc.on("error", reject);

      const pageWidth = doc.page.width;
      const pageHeight = doc.page.height;

      // Add letterhead background
      const addLetterhead = () => {
        doc.image(letterheadPath, 0, 0, {
          width: pageWidth,
          height: pageHeight,
        });
      };

      addLetterhead();

      // Invoice heading
      doc
        .font("Helvetica-Bold")
        .fontSize(20)
        .fillColor("#172B45")
        .text("TAX INVOICE", 40, 180, {
          align: "center",
        });

      // Invoice information
      doc.fontSize(10).fillColor("#222222");

      doc.text(`Invoice Number: ${invoice.invoiceNumber}`, 45, 220);

      doc.text(
        `Issue Date: ${formatDate(invoice.issueDate)}`,
        45,
        238
      );

      doc.text(
        `Due Date: ${formatDate(invoice.dueDate)}`,
        45,
        256
      );

      doc.text(
        `Status: ${invoice.status}`,
        45,
        274
      );

      // Customer details
      const customer = invoice.customerId;

      doc
        .font("Helvetica-Bold")
        .fontSize(11)
        .text("BILL TO:", 45, 310);

      doc
        .font("Helvetica")
        .fontSize(10)
        .text(customer?.name || "Customer", 45, 328);

      doc.text(customer?.phone || "", 45, 344);
      doc.text(customer?.email || "", 45, 360);

      if (customer?.address) {
        const address = customer.address;

        doc.text(
          [
            address.street,
            address.city,
            address.state,
            address.pincode,
            address.country,
          ]
            .filter(Boolean)
            .join(", "),
          45,
          376,
          { width: 240 }
        );
      }

      // Project details
      if (invoice.projectId) {
        doc
          .font("Helvetica-Bold")
          .text("PROJECT:", 340, 310);

        doc
          .font("Helvetica")
          .text(invoice.projectId.name || "", 340, 328, {
            width: 200,
          });

        doc.text(
          invoice.projectId.projectCode || "",
          340,
          344
        );
      }

      // Items table
      const tableTop = 420;
      const columns = {
        description: 45,
        quantity: 310,
        rate: 385,
        amount: 480,
      };

      doc
        .rect(40, tableTop, pageWidth - 80, 25)
        .fill("#172B45");

      doc
        .fillColor("#FFFFFF")
        .font("Helvetica-Bold")
        .fontSize(9);

      doc.text("Description", columns.description + 5, tableTop + 8);
      doc.text("Qty", columns.quantity, tableTop + 8);
      doc.text("Rate", columns.rate, tableTop + 8);
      doc.text("Amount", columns.amount, tableTop + 8);

      let y = tableTop + 35;

      doc.font("Helvetica").fontSize(9).fillColor("#222222");

      invoice.items.forEach((item, index) => {
        if (y > 625) {
          doc.addPage();
          addLetterhead();
          y = 190;
        }

        if (index % 2 === 0) {
          doc
            .rect(40, y - 5, pageWidth - 80, 30)
            .fill("#F3F5F7");
        }

        doc.fillColor("#222222");

        doc.text(item.description, 50, y, {
          width: 245,
        });

        doc.text(
          `${item.quantity} ${item.unit || ""}`,
          columns.quantity,
          y,
          { width: 65 }
        );

        doc.text(formatCurrency(item.rate), columns.rate, y, {
          width: 85,
        });

        doc.text(
          formatCurrency(item.amount),
          columns.amount,
          y,
          { width: 75 }
        );

        y += 32;
      });

      // Financial summary
      y += 15;

      const summaryX = 340;

      const summaryRow = (label, value) => {
        doc
          .font("Helvetica")
          .fontSize(10)
          .fillColor("#222222")
          .text(label, summaryX, y);

        doc.text(value, 445, y, {
          width: 105,
          align: "right",
        });

        y += 20;
      };

      summaryRow("Subtotal:", formatCurrency(invoice.subtotal));
      summaryRow("Discount:", formatCurrency(invoice.discount));
      summaryRow(`Tax (${invoice.taxRate}%):`, formatCurrency(invoice.taxAmount));

      doc
        .moveTo(summaryX, y)
        .lineTo(550, y)
        .stroke("#172B45");

      y += 10;

      doc
        .font("Helvetica-Bold")
        .fontSize(12)
        .fillColor("#172B45")
        .text("Grand Total:", summaryX, y);

      doc.text(formatCurrency(invoice.total), 445, y, {
        width: 105,
        align: "right",
      });

      y += 25;

      summaryRow("Amount Paid:", formatCurrency(invoice.amountPaid));
      summaryRow("Balance Due:", formatCurrency(invoice.balanceDue));

      // Notes
      if (invoice.notes) {
        y += 15;

        doc
          .font("Helvetica-Bold")
          .fontSize(10)
          .fillColor("#172B45")
          .text("Notes:", 45, y);

        doc
          .font("Helvetica")
          .fontSize(9)
          .fillColor("#222222")
          .text(invoice.notes, 45, y + 16, {
            width: 480,
          });
      }

      // End PDF
      doc.end();
    } catch (error) {
      reject(error);
    }
  });
};
