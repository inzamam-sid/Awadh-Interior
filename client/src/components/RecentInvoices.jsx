
import { useState } from "react";
import { FileText, Download, Loader2 } from "lucide-react";
import { downloadInvoicePdf } from "../services/invoiceService";

const invoices = [
  {
    id: "6afca314ad59469975499c13",
    invoiceNumber: "AI-INV-2026-0001",
    customer: "Rahul Sharma",
    total: 50740,
    status: "PAID",
    date: "18 Nov 2026",
  },
];

function RecentInvoices() {
  const [downloadingId, setDownloadingId] = useState(null);

  const handleDownload = async (invoice) => {
    try {
      setDownloadingId(invoice.id);

      await downloadInvoicePdf(
        invoice.id,
        invoice.invoiceNumber
      );
    } catch (error) {
      console.error("Invoice PDF download failed:", error);
      alert("Unable to download invoice PDF. Please try again.");
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-100 p-5">
        <h2 className="font-bold text-awadh-navy">
          Recent Invoices
        </h2>
        <p className="mt-1 text-xs text-slate-500">
          Download generated invoices
        </p>
      </div>

      <div className="divide-y divide-slate-100">
        {invoices.map((invoice) => (
          <div
            key={invoice.id}
            className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex items-start gap-3">
              <div className="rounded-lg bg-blue-100 p-3 text-blue-700">
                <FileText size={20} />
              </div>

              <div>
                <h3 className="text-sm font-semibold text-slate-800">
                  {invoice.invoiceNumber}
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  {invoice.customer}
                </p>

                <p className="mt-1 text-sm font-semibold text-awadh-navy">
                  ₹{invoice.total.toLocaleString("en-IN")}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                {invoice.status}
              </span>

              <button
                onClick={() => handleDownload(invoice)}
                disabled={downloadingId === invoice.id}
                className="flex items-center gap-2 rounded-lg bg-awadh-navy px-4 py-2 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {downloadingId === invoice.id ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Downloading
                  </>
                ) : (
                  <>
                    <Download size={16} />
                    PDF
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RecentInvoices;
