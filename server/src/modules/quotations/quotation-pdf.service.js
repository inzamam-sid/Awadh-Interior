
import PDFDocument from "pdfkit";
import Quotation from "./quotation.model.js";
import ApiError from "../../utils/api-error.js";

export const generateQuotationPdf = async ({
  organizationId,
  quotationId,
}) => {
  const quotation = await Quotation.findOne({
    _id: quotationId,
    organizationId,
  })
    .populate("customerId")
    .populate("projectId", "name projectCode")
    .populate("createdBy", "name");

  if (!quotation) {
    throw new ApiError(
      404,
      "QUOTATION_NOT_FOUND",
      "Quotation not found."
    );
  }

  const doc = new PDFDocument({
    size: "A4",
    margin: 45,
    bufferPages: true,
    info: {
      Title: `Quotation ${quotation.quotationNumber}`,
      Author: "Awadh Interior",
      Subject: "Interior work quotation",
    },
  });

  const buffers = [];

  doc.on("data", (chunk) => buffers.push(chunk));

  const pdfReady = new Promise((resolve, reject) => {
    doc.on("end", () => resolve(Buffer.concat(buffers)));
    doc.on("error", reject);
  });

  const pageWidth =
    doc.page.width - doc.page.margins.left - doc.page.margins.right;

  const formatMoney = (amount) =>
    `INR ${Number(amount || 0).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  const line = (y) => {
    doc
      .moveTo(doc.page.margins.left, y)
      .lineTo(doc.page.margins.left + pageWidth, y)
      .strokeColor("#D9E2F0")
      .stroke();
  };

  // Company heading
  doc
    .fillColor("#135EC1")
    .font("Helvetica-Bold")
    .fontSize(24)
    .text("AWADH INTERIOR");

  doc
    .fillColor("#4B5563")
    .font("Helvetica")
    .fontSize(10)
    .text("Interior Design • POP • False Ceiling");

  doc.moveDown(1.2);

  line(doc.y);

  doc.moveDown(1);

  // Quotation heading and metadata
  doc
    .fillColor("#111827")
    .font("Helvetica-Bold")
    .fontSize(20)
    .text("QUOTATION");

  doc.moveDown(0.5);

  doc.fontSize(10).font("Helvetica");

  const quotationDate = quotation.createdAt
    ? new Date(quotation.createdAt).toLocaleDateString("en-IN")
    : new Date().toLocaleDateString("en-IN");

  doc.text(`Quotation No: ${quotation.quotationNumber}`);
  doc.text(`Date: ${quotationDate}`);

  if (quotation.validUntil) {
    doc.text(
      `Valid Until: ${new Date(quotation.validUntil).toLocaleDateString("en-IN")}`
    );
  }

  doc.moveDown(1);

  // Customer and project details
  doc
    .font("Helvetica-Bold")
    .fontSize(11)
    .fillColor("#135EC1")
    .text("CUSTOMER DETAILS");

  doc.moveDown(0.4);

  doc.font("Helvetica").fontSize(10).fillColor("#111827");

  const customer = quotation.customerId;

  doc.text(`Name: ${customer?.name || "Customer"}`);

  if (customer?.phone) {
    doc.text(`Phone: ${customer.phone}`);
  }

  if (customer?.email) {
    doc.text(`Email: ${customer.email}`);
  }

  if (customer?.address) {
    const address = [
      customer.address.street,
      customer.address.city,
      customer.address.state,
      customer.address.pincode,
      customer.address.country,
    ]
      .filter(Boolean)
      .join(", ");

    if (address) doc.text(`Address: ${address}`);
  }

  if (quotation.projectId) {
    doc.moveDown(0.5);
    doc
      .font("Helvetica-Bold")
      .text(`Project: ${quotation.projectId.name}`);

    if (quotation.projectId.projectCode) {
      doc
        .font("Helvetica")
        .text(`Project Code: ${quotation.projectId.projectCode}`);
    }
  }

  doc.moveDown(1);

  // Item table
  const columns = {
    description: doc.page.margins.left,
    quantity: doc.page.margins.left + pageWidth * 0.53,
    rate: doc.page.margins.left + pageWidth * 0.68,
    amount: doc.page.margins.left + pageWidth * 0.82,
  };

  const drawTableHeader = () => {
    const y = doc.y;

    doc
      .rect(doc.page.margins.left, y, pageWidth, 25)
      .fill("#135EC1");

    doc
      .fillColor("#FFFFFF")
      .font("Helvetica-Bold")
      .fontSize(9);

    doc.text("Description", columns.description + 6, y + 8, {
      width: pageWidth * 0.49,
    });

    doc.text("Qty", columns.quantity, y + 8, {
      width: pageWidth * 0.12,
      align: "right",
    });

    doc.text("Rate", columns.rate, y + 8, {
      width: pageWidth * 0.12,
      align: "right",
    });

    doc.text("Amount", columns.amount, y + 8, {
      width: pageWidth * 0.17,
      align: "right",
    });

    doc.y = y + 25;
  };

  drawTableHeader();

  doc.font("Helvetica").fontSize(9).fillColor("#111827");

  for (const item of quotation.items) {
    const descriptionHeight = doc.heightOfString(
      item.description,
      { width: pageWidth * 0.47 }
    );

    const rowHeight = Math.max(27, descriptionHeight + 12);

    if (doc.y + rowHeight > doc.page.height - 150) {
      doc.addPage();
      drawTableHeader();
      doc.font("Helvetica").fontSize(9).fillColor("#111827");
    }

    const y = doc.y;

    doc.text(item.description, columns.description + 6, y + 7, {
      width: pageWidth * 0.47,
    });

    doc.text(
      `${item.quantity} ${item.unit}`,
      columns.quantity,
      y + 7,
      { width: pageWidth * 0.12, align: "right" }
    );

    doc.text(formatMoney(item.rate), columns.rate, y + 7, {
      width: pageWidth * 0.12,
      align: "right",
    });

    doc.text(formatMoney(item.amount), columns.amount, y + 7, {
      width: pageWidth * 0.17,
      align: "right",
    });

    doc.y = y + rowHeight;

    line(doc.y);
    doc.moveDown(0.3);
  }

  // Financial summary
  doc.moveDown(0.7);

  const summaryLabelX = doc.page.margins.left + pageWidth * 0.48;
  const summaryValueX = doc.page.margins.left + pageWidth * 0.70;
  const summaryWidth = pageWidth * 0.30;

  const drawSummaryRow = (label, value, options = {}) => {
    if (doc.y > doc.page.height - 100) {
      doc.addPage();
    }

    const y = doc.y;

    doc
      .font(options.bold ? "Helvetica-Bold" : "Helvetica")
      .fontSize(options.size || 10)
      .fillColor(options.color || "#111827")
      .text(label, summaryLabelX, y, {
        width: pageWidth * 0.22,
      });

    doc.text(value, summaryValueX, y, {
      width: summaryWidth,
      align: "right",
    });

    doc.y = y + 20;
  };

  drawSummaryRow("Subtotal", formatMoney(quotation.subtotal));

  drawSummaryRow("Discount", `- ${formatMoney(quotation.discount)}`);

  drawSummaryRow(
    `Tax (${quotation.taxRate}%)`,
    formatMoney(quotation.taxAmount)
  );

  line(doc.y);

  doc.moveDown(0.5);

  drawSummaryRow("GRAND TOTAL", formatMoney(quotation.total), {
    bold: true,
    size: 13,
    color: "#135EC1",
  });

  // Terms and conditions
  if (quotation.terms) {
    if (doc.y > doc.page.height - 120) {
      doc.addPage();
    }

    doc.moveDown(1);

    doc
      .font("Helvetica-Bold")
      .fontSize(11)
      .fillColor("#135EC1")
      .text("TERMS & CONDITIONS");

    doc.moveDown(0.4);

    doc
      .font("Helvetica")
      .fontSize(9)
      .fillColor("#374151")
      .text(quotation.terms, {
        width: pageWidth,
        lineGap: 3,
      });
  }

  // Footer on every page
  const range = doc.bufferedPageRange();

  for (let i = range.start; i < range.start + range.count; i++) {
    doc.switchToPage(i);

    const footerY = doc.page.height - 35;

    doc
      .font("Helvetica")
      .fontSize(8)
      .fillColor("#6B7280")
      .text(
        "Thank you for considering Awadh Interior.",
        doc.page.margins.left,
        footerY,
        {
          width: pageWidth,
          align: "center",
        }
      );
  }

  doc.end();

  return pdfReady;
};
