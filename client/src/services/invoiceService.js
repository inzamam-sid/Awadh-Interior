
import axios from "axios";

const API_URL = "http://localhost:5000/api/v1/invoices";

export const getInvoices = async () => {
  const token = localStorage.getItem("token");

  const response = await axios.get(API_URL, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data.data;
};

export const downloadInvoicePdf = async (invoiceId, invoiceNumber) => {
  const token = localStorage.getItem("token");

  const response = await axios.get(`${API_URL}/${invoiceId}/pdf`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    responseType: "blob",
  });

  // Convert response into a downloadable file
  const pdfBlob = new Blob([response.data], {
    type: "application/pdf",
  });

  const downloadUrl = window.URL.createObjectURL(pdfBlob);

  const link = document.createElement("a");
  link.href = downloadUrl;
  link.download = `${invoiceNumber || "invoice"}.pdf`;

  document.body.appendChild(link);
  link.click();

  link.remove();
  window.URL.revokeObjectURL(downloadUrl);
};
