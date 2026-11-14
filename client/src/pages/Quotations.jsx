
import { useEffect, useState } from "react";
import axios from "axios";
import {
  Plus,
  FileText,
  RefreshCw,
  Download,
  Eye,
  Send,
  Trash2,
  X,
} from "lucide-react";
import QuotationForm from "../components/QuotationForm";

function Quotations() {
  const [quotations, setQuotations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [selectedQuotation, setSelectedQuotation] = useState(null);
const [detailsLoading, setDetailsLoading] = useState(false);
const [actionLoading, setActionLoading] = useState("");
 
  // Fetch quotations
  const fetchQuotations = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      const response = await axios.get(
        "http://localhost:5000/api/v1/quotations",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = response.data.data;

      setQuotations(
        Array.isArray(data) ? data : data?.quotations || []
      );
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to load quotations."
      );
    } finally {
      setLoading(false);
    }
  };



    const handleDownload = async (quotation) => {
    try {
        const token = localStorage.getItem("token");

        const response = await axios.get(
        `http://localhost:5000/api/v1/quotations/${quotation._id}/pdf`,
        {
            headers: {
            Authorization: `Bearer ${token}`,
            },
            responseType: "blob",
        }
        );

        // Create a temporary download link
        const file = new Blob([response.data], {
        type: "application/pdf",
        });

        const url = window.URL.createObjectURL(file);

        const link = document.createElement("a");
        link.href = url;
        link.download = `${quotation.quotationNumber}.pdf`;

        document.body.appendChild(link);
        link.click();

        link.remove();
        window.URL.revokeObjectURL(url);

    } catch (error) {
        console.error("PDF download failed:", error);
        alert("Unable to download quotation PDF.");
    }
    };


const getAuthConfig = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

// View quotation details
const handleView = async (quotation) => {
  try {
    setDetailsLoading(true);
    setSelectedQuotation(null);

    const response = await axios.get(
      `http://localhost:5000/api/v1/quotations/${quotation._id}`,
      getAuthConfig()
    );

    setSelectedQuotation(response.data.data);
  } catch (error) {
    alert(
      error.response?.data?.message ||
      "Unable to load quotation details."
    );
  } finally {
    setDetailsLoading(false);
  }
};

// Send quotation
const handleSend = async (quotation) => {
  if (!window.confirm(`Send quotation ${quotation.quotationNumber}?`)) {
    return;
  }

  try {
    setActionLoading(quotation._id);

    await axios.patch(
      `http://localhost:5000/api/v1/quotations/${quotation._id}/send`,
      {},
      getAuthConfig()
    );

    await fetchQuotations();
    alert("Quotation sent successfully!");
  } catch (error) {
    alert(
      error.response?.data?.message ||
      "Unable to send quotation."
    );
  } finally {
    setActionLoading("");
  }
};

// Delete quotation
const handleDelete = async (quotation) => {
  if (!window.confirm(`Delete quotation ${quotation.quotationNumber}? This cannot be undone.`)) {
    return;
  }

  try {
    setActionLoading(quotation._id);

    await axios.delete(
      `http://localhost:5000/api/v1/quotations/${quotation._id}`,
      getAuthConfig()
    );

    await fetchQuotations();
    alert("Quotation deleted successfully!");
  } catch (error) {
    alert(
      error.response?.data?.message ||
      "Unable to delete quotation."
    );
  } finally {
    setActionLoading("");
  }
};




  useEffect(() => {
    fetchQuotations();
  }, []);

  // Handle successful creation
  const handleSuccess = () => {
    setShowForm(false);
    fetchQuotations();
  };

  return (
    <div className="space-y-6">

      {/* Page Heading */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">
            Quotations
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Manage customer quotations and estimates.
          </p>
        </div>

        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 rounded-lg bg-awadh-gold px-4 py-2.5 text-sm font-semibold text-white hover:opacity-90"
        >
          <Plus size={18} />
          Create Quotation
        </button>
      </div>

      {/* Quotations Table */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <div className="flex items-center justify-between border-b p-5">
          <h3 className="font-semibold text-slate-900">
            All Quotations
          </h3>

          <button
            onClick={fetchQuotations}
            className="flex items-center gap-2 text-sm text-slate-600 hover:text-awadh-gold"
          >
            <RefreshCw size={16} />
            Refresh
          </button>
        </div>

        {loading ? (
          <p className="p-8 text-center text-slate-500">
            Loading quotations...
          </p>
        ) : error ? (
          <p className="p-8 text-center text-red-600">
            {error}
          </p>
        ) : quotations.length === 0 ? (
          <div className="p-12 text-center">
            <FileText
              size={40}
              className="mx-auto mb-3 text-slate-300"
            />
            <h3 className="font-semibold text-slate-700">
              No quotations found
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              Create your first quotation to get started.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-600">
                <tr>
                    <th className="p-4">Quotation No.</th>
                    <th className="p-4">Customer</th>
                    <th className="p-4">Total Amount</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Date</th>
                    <th className="p-4">Actions</th>
                </tr>
                </thead>

              
                <tbody className="divide-y divide-slate-100">
                {quotations.map((quotation) => (
                    <tr key={quotation._id}>
                    <td className="p-4 font-medium text-slate-900">
                        {quotation.quotationNumber}
                    </td>

                    <td className="p-4">
                        {quotation.customerId?.name || "Customer"}
                    </td>

                    <td className="p-4 font-medium">
                        ₹{Number(quotation.total || 0).toLocaleString("en-IN")}
                    </td>

                    <td className="p-4">
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium">
                        {quotation.status}
                        </span>
                    </td>

                    <td className="p-4 text-slate-500">
                        {new Date(quotation.createdAt).toLocaleDateString("en-IN")}
                    </td>

                    <td className="p-4">
                        <div className="flex flex-wrap items-center gap-2">
                        {/* View */}
                        <button
                            onClick={() => handleView(quotation)}
                            title="View Details"
                            className="rounded-lg border p-2 text-slate-600 hover:border-blue-400 hover:text-blue-600"
                        >
                            <Eye size={16} />
                        </button>

                        {/* Download PDF */}
                        <button
                            onClick={() => handleDownload(quotation)}
                            title="Download PDF"
                            className="rounded-lg border p-2 text-slate-600 hover:border-awadh-gold hover:text-awadh-gold"
                        >
                            <Download size={16} />
                        </button>

                        {/* Send - only for DRAFT */}
                        {quotation.status === "DRAFT" && (
                            <button
                            onClick={() => handleSend(quotation)}
                            disabled={actionLoading === quotation._id}
                            title="Send Quotation"
                            className="rounded-lg border p-2 text-green-600 hover:border-green-400 disabled:opacity-50"
                            >
                            <Send size={16} />
                            </button>
                        )}

                        {/* Delete - only for DRAFT */}
                        {quotation.status === "DRAFT" && (
                            <button
                            onClick={() => handleDelete(quotation)}
                            disabled={actionLoading === quotation._id}
                            title="Delete Quotation"
                            className="rounded-lg border p-2 text-red-600 hover:border-red-400 disabled:opacity-50"
                            >
                            <Trash2 size={16} />
                            </button>
                        )}
                        </div>
                    </td>
                    </tr>
                ))}
                </tbody>

            </table>
          </div>
        )}
      </div>

      {/* Create Quotation Modal */}
      {showForm && (
        <QuotationForm
          onClose={() => setShowForm(false)}
          onSuccess={handleSuccess}
        />
      )}
    </div>
  );
}

export default Quotations;
