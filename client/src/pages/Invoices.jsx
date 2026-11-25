import { useEffect, useState } from "react";
import { getInvoices } from "../services/invoiceService";
import { downloadInvoicePdf } from "../services/invoiceService";
import InvoiceDetails from "./InvoiceDetails";

function Invoices() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getInvoices();
      setInvoices(data || []);
    } catch (err) {
      console.error("Error fetching invoices:", err);
      setError("Failed to load invoices.");
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount || 0);
  };

  const formatDate = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getStatusStyle = (status) => {
    switch (status?.toUpperCase()) {
        case "PAID":
        return "bg-emerald-100 text-emerald-700";

        case "PARTIALLY_PAID":
        case "PARTIAL":
        return "bg-amber-100 text-amber-700";

        case "PENDING":
        return "bg-blue-100 text-blue-700";

        case "OVERDUE":
        return "bg-red-100 text-red-700";

        case "CANCELLED":
        return "bg-slate-100 text-slate-600";

        default:
        return "bg-slate-100 text-slate-700";
    }
    };

    const totalInvoiced = invoices.reduce(
        (sum, invoice) => sum + (invoice.total || 0),
        0
    );

  const totalCollected = invoices.reduce(
    (sum, invoice) => sum + (invoice.amountPaid || 0),
    0
  );

  const totalOutstanding = invoices.reduce(
    (sum, invoice) => sum + (invoice.balanceDue || 0),
    0
  );

  const totalInvoices = invoices.length;

  if (selectedInvoice) {
    return (
        <InvoiceDetails
        invoice={selectedInvoice}
        onBack={() => setSelectedInvoice(null)}
        onDownload={() =>
            downloadInvoicePdf(
            selectedInvoice._id,
            selectedInvoice.invoiceNumber
            )
        }
        />
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <div className="text-slate-500 font-medium">Loading invoices...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 p-5 rounded-xl">
        {error}
        <button
          onClick={fetchInvoices}
          className="ml-3 underline font-semibold"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Invoices</h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage invoices and track payments.
          </p>
        </div>

        <button
          onClick={fetchInvoices}
          className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          Refresh
        </button>
      </div>

            {/* Invoice Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {/* Total Invoiced */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-sm text-slate-500 font-medium">Total Invoiced</p>
          <h3 className="text-2xl font-bold text-slate-800 mt-2">
            {formatCurrency(totalInvoiced)}
          </h3>
          <p className="text-xs text-slate-400 mt-2">All invoices combined</p>
        </div>

        {/* Total Collected */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-sm text-slate-500 font-medium">Total Collected</p>
          <h3 className="text-2xl font-bold text-emerald-600 mt-2">
            {formatCurrency(totalCollected)}
          </h3>
          <p className="text-xs text-slate-400 mt-2">Payments received</p>
        </div>

        {/* Outstanding */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-sm text-slate-500 font-medium">Outstanding</p>
          <h3 className="text-2xl font-bold text-rose-600 mt-2">
            {formatCurrency(totalOutstanding)}
          </h3>
          <p className="text-xs text-slate-400 mt-2">Pending collection</p>
        </div>

        {/* Total Invoices */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-sm text-slate-500 font-medium">Total Invoices</p>
          <h3 className="text-2xl font-bold text-indigo-600 mt-2">
            {totalInvoices}
          </h3>
          <p className="text-xs text-slate-400 mt-2">Invoices generated</p>
        </div>
      </div>

      {/* Invoice Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-5 py-4 text-left font-semibold text-slate-600">
                  Invoice
                </th>
                <th className="px-5 py-4 text-left font-semibold text-slate-600">
                  Customer
                </th>
                <th className="px-5 py-4 text-left font-semibold text-slate-600">
                  Project
                </th>
                <th className="px-5 py-4 text-left font-semibold text-slate-600">
                  Issue Date
                </th>
                <th className="px-5 py-4 text-left font-semibold text-slate-600">
                  Due Date
                </th>
                <th className="px-5 py-4 text-left font-semibold text-slate-600">
                  Total Amount
                </th>
                <th className="px-5 py-4 text-left font-semibold text-slate-600">
                  Paid
                </th>
                <th className="px-5 py-4 text-left font-semibold text-slate-600">
                  Balance
                </th>
                <th className="px-5 py-4 text-left font-semibold text-slate-600">
                  Status
                </th>
                <th className="px-5 py-4 text-left font-semibold text-slate-600">
                  Action
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {invoices.length === 0 ? (
                <tr>
                  <td
                    colSpan="10"
                    className="text-center py-12 text-slate-500"
                  >
                    No invoices found.
                  </td>
                </tr>
              ) : (
                invoices.map((invoice) => (
                  <tr
                    key={invoice._id}
                    className="hover:bg-slate-50 transition-colors"
                  >
                    <td className="px-5 py-4">
                        <button
                            onClick={() => setSelectedInvoice(invoice)}
                            className="font-semibold text-indigo-600 hover:text-indigo-800 hover:underline"
                        >
                            {invoice.invoiceNumber}
                        </button>
                    </td>

                    <td className="px-5 py-4 text-slate-700">
                      {invoice.customerId?.name || "—"}
                    </td>

                    <td className="px-5 py-4 text-slate-600">
                      {invoice.projectId?.name || "—"}
                    </td>

                    <td className="px-5 py-4 text-slate-600">
                      {formatDate(invoice.issueDate)}
                    </td>

                    <td className="px-5 py-4 text-slate-600">
                      {formatDate(invoice.dueDate)}
                    </td>

                    <td className="px-5 py-4 font-medium text-slate-800">
                      {formatCurrency(invoice.total)}
                    </td>

                    <td className="px-5 py-4 text-emerald-600 font-medium">
                      {formatCurrency(invoice.amountPaid)}
                    </td>

                    <td className="px-5 py-4 text-rose-600 font-medium">
                      {formatCurrency(invoice.balanceDue)}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-semibold ${getStatusStyle(
                            invoice.status
                        )}`}
                        >
                        {invoice.status?.replace(/_/g, " ") || "UNKNOWN"}
                       </span>
                    </td>

                    <td className="px-5 py-4">
                      <button
                        onClick={() =>
                          downloadInvoicePdf(
                            invoice._id,
                            invoice.invoiceNumber
                          )
                        }
                        className="text-indigo-600 font-medium hover:text-indigo-800"
                      >
                        Download PDF
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Invoices;