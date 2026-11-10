
import PDFDocument from "pdfkit";
import Quotation from "./quotation.model.js";
import ApiError from "../../utils/api-error.js";
import { fileURLToPath } from "url";

const letterheadPath = fileURLToPath(
  new URL("../../assets/awadh-letterhead.png", import.meta.url)
);

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
    margins: {
      top: 205,
      bottom: 125,
      left: 45,
      right: 45,
    },
    bufferPages: true,
    info: {
      Title: `Quotation ${quotation.quotationNumber}`,
      Author: "Awadh Interior",
    },
  });

  const buffers = [];

  doc.on("data", (chunk) => buffers.push(chunk));

  const pdfReady = new Promise((resolve, reject) => {
    doc.on("end", () => resolve(Buffer.concat(buffers)));
    doc.on("error", reject);
  });

  // Draw the official letterhead on every page.
  const drawLetterhead = () => {
    doc.image(letterheadPath, 0, 0, {
      width: doc.page.width,
      height: doc.page.height,
    });

    doc.x = 45;
    doc.y = 205;
  };

  doc.on("pageAdded", drawLetterhead);

  // Draw the background on the first page.
  drawLetterhead();

  const pageWidth = doc.page.width - 90;
  const bottomLimit = doc.page.height - 125;

  const navy = "#071C3A";
  const gold = "#B88632";
  const textColor = "#263445";

  const formatMoney = (amount) =>
    `Rs. ${Number(amount || 0).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  const formatDate = (date) =>
    date ? new Date(date).toLocaleDateString("en-IN") : "-";

  const drawLine = () => {
    doc
      .moveTo(45, doc.y)
      .lineTo(doc.page.width - 45, doc.y)
      .strokeColor("#D6DCE5")
      .lineWidth(0.7)
      .stroke();
  };

  const checkSpace = (height) => {
    if (doc.y + height > bottomLimit) {
      doc.addPage();
    }
  };

  // Quotation heading
  doc
    .fillColor(navy)
    .font("Helvetica-Bold")
    .fontSize(18)
    .text("QUOTATION");

  doc.moveDown(0.5);

  doc
    .font("Helvetica")
    .fontSize(9)
    .fillColor(textColor)
    .text(`Quotation No: ${quotation.quotationNumber}`);

  doc.text(`Date: ${formatDate(quotation.createdAt)}`);

  if (quotation.validUntil) {
    doc.text(`Valid Until: ${formatDate(quotation.validUntil)}`);
  }

  doc.moveDown(1);

  // Customer details
  doc
    .font("Helvetica-Bold")
    .fontSize(10)
    .fillColor(gold)
    .text("BILL TO");

  doc.moveDown(0.4);

  const customer = quotation.customerId;

  doc
    .font("Helvetica-Bold")
    .fontSize(10)
    .fillColor(navy)
    .text(customer?.name || "Customer");

  doc
    .font("Helvetica")
    .fontSize(9)
    .fillColor(textColor);

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
    doc.moveDown(0.3);

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

  // Items table
  const tableX = 45;
  const descriptionX = 51;
  const quantityX = 295;
  const rateX = 365;
  const amountX = 450;

  const drawTableHeader = () => {
    const y = doc.y;

    doc
      .rect(tableX, y, pageWidth, 24)
      .fill(navy);

    doc
      .font("Helvetica-Bold")
      .fontSize(8)
      .fillColor("#FFFFFF");

    doc.text("DESCRIPTION", descriptionX, y + 8, {
      width: 225,
    });

    doc.text("QTY", quantityX, y + 8, {
      width: 60,
      align: "right",
    });

    doc.text("RATE", rateX, y + 8, {
      width: 75,
      align: "right",
    });

    doc.text("AMOUNT", amountX, y + 8, {
      width: 95,
      align: "right",
    });

    doc.y = y + 24;
  };

  drawTableHeader();

  quotation.items.forEach((item) => {
    doc.font("Helvetica").fontSize(8);

    const descriptionHeight = doc.heightOfString(
      item.description,
      { width: 220 }
    );

    const rowHeight = Math.max(28, descriptionHeight + 12);

    if (doc.y + rowHeight > bottomLimit) {
      doc.addPage();
      drawTableHeader();
    }

    const y = doc.y;

    doc
      .font("Helvetica")
      .fontSize(8)
      .fillColor(textColor);

    doc.text(item.description, descriptionX, y + 8, {
      width: 220,
    });

    doc.text(`${item.quantity} ${item.unit}`, quantityX, y + 8, {
      width: 60,
      align: "right",
    });

    doc.text(formatMoney(item.rate), rateX, y + 8, {
      width: 75,
      align: "right",
    });

    doc.text(formatMoney(item.amount), amountX, y + 8, {
      width: 95,
      align: "right",
    });

    doc.y = y + rowHeight;
    drawLine();
    doc.moveDown(0.3);
  });

  // Financial summary
  checkSpace(105);

  doc.moveDown(0.5);

  const drawSummaryRow = (label, value, bold = false) => {
    const y = doc.y;

    doc
      .font(bold ? "Helvetica-Bold" : "Helvetica")
      .fontSize(bold ? 11 : 9)
      .fillColor(bold ? navy : textColor);

    doc.text(label, 300, y, {
      width: 110,
    });

    doc.text(value, 410, y, {
      width: 130,
      align: "right",
    });

    doc.y = y + 19;
  };

  drawSummaryRow("Subtotal", formatMoney(quotation.subtotal));

  drawSummaryRow("Discount", `- ${formatMoney(quotation.discount)}`);

  drawSummaryRow(
    `Tax (${quotation.taxRate}%)`,
    formatMoney(quotation.taxAmount)
  );

  drawLine();
  doc.moveDown(0.5);

  drawSummaryRow(
    "GRAND TOTAL",
    formatMoney(quotation.total),
    true
  );

  // Terms and conditions
  if (quotation.terms) {
    const termsHeight = doc.heightOfString(quotation.terms, {
      width: pageWidth,
      font: "Helvetica",
      fontSize: 8,
    });

    checkSpace(termsHeight + 40);

    doc.moveDown(1);

    doc
      .font("Helvetica-Bold")
      .fontSize(10)
      .fillColor(gold)
      .text("TERMS & CONDITIONS");

    doc.moveDown(0.4);

    doc
      .font("Helvetica")
      .fontSize(8)
      .fillColor(textColor)
      .text(quotation.terms, {
        width: pageWidth,
        lineGap: 3,
      });
  }

  // Signature section
  checkSpace(65);

  doc.moveDown(2);

  doc
    .font("Helvetica")
    .fontSize(9)
    .fillColor(textColor)
    .text("Authorized Signature", 360, doc.y, {
      width: 180,
      align: "center",
    });

  doc.moveTo(375, doc.y - 5)
    .lineTo(525, doc.y - 5)
    .strokeColor(navy)
    .stroke();

  doc.end();

  return pdfReady;
};
