function InvoiceDetails({ invoice, onBack, onDownload }) {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(amount || 0);
  };

  const formatDate = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "long",
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
      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <button
            onClick={onBack}
            className="text-sm text-indigo-600 hover:text-indigo-800 font-medium mb-3"
          >
            ← Back to Invoices
          </button>

          <h1 className="text-2xl font-bold text-slate-800">
            Invoice Details
          </h1>

          <p className="text-slate-500 mt-1">
            {invoice.invoiceNumber}
          </p>
        </div>

        <button
          onClick={onDownload}
          className="px-4 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium text-sm"
        >
          Download PDF
        </button>
      </div>

      {/* Invoice Overview */}
      <div className="bg-white border border-slate-200 rounded-xl p-6">
        <div className="flex flex-wrap justify-between items-start gap-4">
          <div>
            <p className="text-sm text-slate-500">Invoice Number</p>
            <h2 className="text-xl font-bold text-indigo-600 mt-1">
              {invoice.invoiceNumber}
            </h2>
          </div>

          <span
            className={`px-3 py-1.5 rounded-full text-xs font-semibold ${getStatusStyle(
              invoice.status
            )}`}
          >
            {invoice.status?.replace(/_/g, " ") || "UNKNOWN"}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mt-6 pt-6 border-t border-slate-100">
          <div>
            <p className="text-sm text-slate-500">Issue Date</p>
            <p className="font-semibold text-slate-800 mt-1">
              {formatDate(invoice.issueDate)}
            </p>
          </div>

          <div>
            <p className="text-sm text-slate-500">Due Date</p>
            <p className="font-semibold text-slate-800 mt-1">
              {formatDate(invoice.dueDate)}
            </p>
          </div>

          <div>
            <p className="text-sm text-slate-500">Payment Status</p>
            <p className="font-semibold text-slate-800 mt-1">
              {invoice.status?.replace(/_/g, " ") || "UNKNOWN"}
            </p>
          </div>
        </div>
      </div>

      {/* Customer & Project Information */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Customer */}
        <div className="bg-white border border-slate-200 rounded-xl p-6">
          <h3 className="font-semibold text-slate-800 mb-4">
            Customer Information
          </h3>

          <div className="space-y-3 text-sm">
            <div>
              <p className="text-slate-500">Name</p>
              <p className="font-medium text-slate-800">
                {invoice.customerId?.name || invoice.customerName || "—"}
              </p>
            </div>

            <div>
              <p className="text-slate-500">Email</p>
              <p className="text-slate-800">
                {invoice.customerId?.email || invoice.customerEmail || "—"}
              </p>
            </div>

            <div>
              <p className="text-slate-500">Phone</p>
              <p className="text-slate-800">
                {invoice.customerId?.phone || invoice.customerPhone || "—"}
              </p>
            </div>

            <div>
              <p className="text-slate-500">Address</p>
              <p className="text-slate-800">
                {[
                    invoice.customerId?.address?.street,
                    invoice.customerId?.address?.city,
                    invoice.customerId?.address?.state,
                    invoice.customerId?.address?.pincode,
                    invoice.customerId?.address?.country,
                    ]
                    .filter(Boolean)
                    .join(", ") || "—"}
              </p>
            </div>
          </div>
        </div>

        {/* Project */}
        <div className="bg-white border border-slate-200 rounded-xl p-6">
          <h3 className="font-semibold text-slate-800 mb-4">
            Project Information
          </h3>

          <div className="space-y-3 text-sm">
            <div>
              <p className="text-slate-500">Project Name</p>
              <p className="font-medium text-slate-800">
                {invoice.projectId?.name || invoice.projectName || "—"}
              </p>
            </div>

            <div>
              <p className="text-slate-500">Project Code</p>
              <p className="text-slate-800">
                {invoice.projectId?.projectCode || invoice.projectCode || "—"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Invoice Items */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <div className="p-6 border-b border-slate-200">
          <h3 className="font-semibold text-slate-800">Invoice Items</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-5 py-4 text-left text-slate-600">Item</th>
                <th className="px-5 py-4 text-left text-slate-600">Category</th>
                <th className="px-5 py-4 text-right text-slate-600">Quantity</th>
                <th className="px-5 py-4 text-right text-slate-600">Rate</th>
                <th className="px-5 py-4 text-right text-slate-600">Amount</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {(invoice.items || []).map((item, index) => (
                <tr key={item._id || index}>
                  <td className="px-5 py-4 font-medium text-slate-800">
                    {item.description || item.name || "—"}
                  </td>

                  <td className="px-5 py-4 text-slate-600">
                    {item.category || "—"}
                  </td>

                  <td className="px-5 py-4 text-right text-slate-700">
                    {item.quantity} {item.unit || ""}
                  </td>

                  <td className="px-5 py-4 text-right text-slate-700">
                    {formatCurrency(item.rate)}
                  </td>

                  <td className="px-5 py-4 text-right font-medium text-slate-800">
                    {formatCurrency(item.amount)}
                  </td>
                </tr>
              ))}

              {(!invoice.items || invoice.items.length === 0) && (
                <tr>
                  <td colSpan="5" className="text-center py-8 text-slate-500">
                    No invoice items found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invoice Totals */}
      <div className="flex justify-end">
        <div className="w-full sm:max-w-md bg-white border border-slate-200 rounded-xl p-6 space-y-4">
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">Subtotal</span>
            <span className="font-medium text-slate-800">
              {formatCurrency(invoice.subtotal)}
            </span>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-slate-500">Discount</span>
            <span className="text-slate-800">
              − {formatCurrency(invoice.discount)}
            </span>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-slate-500">
              Tax ({invoice.taxRate || 0}%)
            </span>
            <span className="text-slate-800">
              {formatCurrency(invoice.taxAmount)}
            </span>
          </div>

          <div className="border-t border-slate-200 pt-4 flex justify-between">
            <span className="font-semibold text-slate-800">Total Amount</span>
            <span className="text-xl font-bold text-slate-900">
              {formatCurrency(invoice.total)}
            </span>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-emerald-600 font-medium">Amount Paid</span>
            <span className="text-emerald-600 font-semibold">
              {formatCurrency(invoice.amountPaid)}
            </span>
          </div>

          <div className="flex justify-between border-t border-slate-100 pt-3">
            <span className="font-semibold text-slate-800">Balance Due</span>
            <span className="font-bold text-rose-600">
              {formatCurrency(invoice.balanceDue)}
            </span>
          </div>
        </div>
      </div>

      {/* Notes */}
      {invoice.notes && (
        <div className="bg-white border border-slate-200 rounded-xl p-6">
          <h3 className="font-semibold text-slate-800 mb-3">Notes</h3>
          <p className="text-sm text-slate-600 whitespace-pre-wrap">
            {invoice.notes}
          </p>
        </div>
      )}
    </div>
  );
}

export default InvoiceDetails;