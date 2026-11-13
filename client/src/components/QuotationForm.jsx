
import { useEffect, useState } from "react";
import axios from "axios";
import { Plus, Trash2, X } from "lucide-react";

function QuotationForm({ onClose, onSuccess }) {
  const [customers, setCustomers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    customerId: "",
    projectId: "",
    discount: 0,
    taxRate: 0,
    terms: "",
    validUntil: "",
  });

  const [items, setItems] = useState([
    {
      description: "",
      category: "",
      quantity: 1,
      unit: "sq ft",
      rate: 0,
    },
  ]);

  const token = localStorage.getItem("token");

  // Load customers and projects
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        const [customerRes, projectRes] = await Promise.all([
          axios.get("http://localhost:5000/api/v1/customers", config),
          axios.get("http://localhost:5000/api/v1/projects", config),
        ]);

        setCustomers(customerRes.data.data || []);
        setProjects(projectRes.data.data || []);
      } catch (err) {
        setError("Unable to load customers and projects.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  // Update form fields
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Update quotation item
  const handleItemChange = (index, field, value) => {
    const updatedItems = [...items];

    updatedItems[index][field] = value;

    setItems(updatedItems);
  };

  // Add new item
  const addItem = () => {
    setItems([
      ...items,
      {
        description: "",
        category: "",
        quantity: 1,
        unit: "sq ft",
        rate: 0,
      },
    ]);
  };

  // Remove item
  const removeItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  // Calculate subtotal
  const subtotal = items.reduce(
    (total, item) =>
      total + Number(item.quantity) * Number(item.rate),
    0
  );

  const discount = Number(formData.discount) || 0;
  const taxRate = Number(formData.taxRate) || 0;

  const taxAmount =
    ((subtotal - discount) * taxRate) / 100;

  const total = subtotal - discount + taxAmount;

  // Submit quotation
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError("");

      const payload = {
        ...formData,
        items: items.map((item) => ({
          ...item,
          quantity: Number(item.quantity),
          rate: Number(item.rate),
        })),
        discount,
        taxRate,
      };

      const response = await axios.post(
        "http://localhost:5000/api/v1/quotations",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      onSuccess(response.data);
      onClose();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to create quotation."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <p className="p-6">Loading customers and projects...</p>;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-xl bg-white shadow-xl">

        {/* Header */}
        <div className="sticky top-0 flex items-center justify-between border-b bg-white p-5">
          <div>
            <h2 className="text-xl font-bold text-awadh-navy">
              Create Quotation
            </h2>
            <p className="text-sm text-slate-500">
              Prepare a new customer quotation.
            </p>
          </div>

          <button type="button" onClick={onClose}>
            <X size={22} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 p-5">

          {/* Customer and Project */}
          <section className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium">
                Customer *
              </label>

              <select
                name="customerId"
                value={formData.customerId}
                onChange={handleChange}
                required
                className="w-full rounded-lg border p-3"
              >
                <option value="">Select Customer</option>

                {customers.map((customer) => (
                  <option key={customer._id} value={customer._id}>
                    {customer.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Project (Optional)
              </label>

              <select
                name="projectId"
                value={formData.projectId}
                onChange={handleChange}
                className="w-full rounded-lg border p-3"
              >
                <option value="">Select Project</option>

                {projects
                  .filter(
                    (project) =>
                      !formData.customerId ||
                      project.customerId?._id === formData.customerId
                  )
                  .map((project) => (
                    <option key={project._id} value={project._id}>
                      {project.name}
                    </option>
                  ))}
              </select>
            </div>
          </section>

          {/* Quotation Items */}
          <section>
            <div className="mb-3 flex items-center justify-between">
              <h3 className="font-semibold">Quotation Items</h3>

              <button
                type="button"
                onClick={addItem}
                className="flex items-center gap-1 text-sm font-medium text-awadh-gold"
              >
                <Plus size={17} />
                Add Item
              </button>
            </div>

            <div className="space-y-4">
              {items.map((item, index) => (
                <div
                  key={index}
                  className="rounded-lg border border-slate-200 p-4"
                >
                  <div className="mb-3 flex justify-between">
                    <p className="text-sm font-semibold">
                      Item {index + 1}
                    </p>

                    {items.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeItem(index)}
                        className="text-red-500"
                      >
                        <Trash2 size={17} />
                      </button>
                    )}
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                    <input
                      placeholder="Description"
                      value={item.description}
                      onChange={(e) =>
                        handleItemChange(index, "description", e.target.value)
                      }
                      required
                      className="rounded-lg border p-2 lg:col-span-2"
                    />

                    <input
                      placeholder="Category"
                      value={item.category}
                      onChange={(e) =>
                        handleItemChange(index, "category", e.target.value)
                      }
                      required
                      className="rounded-lg border p-2"
                    />

                    <input
                      type="number"
                      min="0.01"
                      step="any"
                      placeholder="Quantity"
                      value={item.quantity}
                      onChange={(e) =>
                        handleItemChange(index, "quantity", e.target.value)
                      }
                      required
                      className="rounded-lg border p-2"
                    />

                    <input
                      placeholder="Unit"
                      value={item.unit}
                      onChange={(e) =>
                        handleItemChange(index, "unit", e.target.value)
                      }
                      required
                      className="rounded-lg border p-2"
                    />

                    <input
                      type="number"
                      min="0"
                      step="any"
                      placeholder="Rate (₹)"
                      value={item.rate}
                      onChange={(e) =>
                        handleItemChange(index, "rate", e.target.value)
                      }
                      required
                      className="rounded-lg border p-2"
                    />

                    <p className="text-sm font-medium text-slate-600 sm:col-span-2 lg:col-span-5">
                      Amount: ₹
                      {(
                        Number(item.quantity) * Number(item.rate)
                      ).toLocaleString("en-IN")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Financial Details */}
          <section className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="mb-2 block text-sm font-medium">
                Discount (₹)
              </label>
              <input
                type="number"
                min="0"
                step="any"
                name="discount"
                value={formData.discount}
                onChange={handleChange}
                className="w-full rounded-lg border p-3"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Tax Rate (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                step="any"
                name="taxRate"
                value={formData.taxRate}
                onChange={handleChange}
                className="w-full rounded-lg border p-3"
              />
            </div>

            <div className="rounded-lg bg-slate-50 p-3">
              <p className="text-sm text-slate-500">Subtotal</p>
              <p className="font-semibold">
                ₹{subtotal.toLocaleString("en-IN")}
              </p>
              <p className="mt-2 text-sm text-slate-500">Tax Amount</p>
              <p className="font-semibold">
                ₹{taxAmount.toLocaleString("en-IN")}
              </p>
              <p className="mt-2 text-sm text-slate-500">Total Amount</p>
              <p className="text-xl font-bold text-awadh-navy">
                ₹{total.toLocaleString("en-IN")}
              </p>
            </div>
          </section>

          {/* Additional Details */}
          <section className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium">
                Valid Until
              </label>
              <input
                type="date"
                name="validUntil"
                value={formData.validUntil}
                onChange={handleChange}
                className="w-full rounded-lg border p-3"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Terms and Conditions
              </label>
              <textarea
                name="terms"
                value={formData.terms}
                onChange={handleChange}
                rows="3"
                placeholder="Enter quotation terms..."
                className="w-full rounded-lg border p-3"
              />
            </div>
          </section>

          {error && (
            <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
              {error}
            </p>
          )}

          {/* Footer */}
          <div className="flex flex-wrap justify-end gap-3 border-t pt-5">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border px-5 py-2.5 text-sm font-medium"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-awadh-gold px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
            >
              {saving ? "Saving..." : "Save Quotation"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default QuotationForm;
