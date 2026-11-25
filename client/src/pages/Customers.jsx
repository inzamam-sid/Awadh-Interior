
import { useEffect, useState } from "react";
import { getCustomers, createCustomer } from "../services/customerService";

function Customers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    propertyType: "Residential",
    source: "WEBSITE",
    address: {
        street: "",
        city: "",
        state: "",
        pincode: "",
        country: "India",
    },
    notes: "",
    tags: [],
    });

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getCustomers();
      setCustomers(data || []);
    } catch (err) {
      console.error("Error fetching customers:", err);
      setError("Failed to load customers.");
    } finally {
      setLoading(false);
    }
  };

  const handleFormChange = (e) => {
  const { name, value } = e.target;

  if (name.startsWith("address.")) {
    const addressField = name.split(".")[1];

    setFormData((prev) => ({
      ...prev,
      address: {
        ...prev.address,
        [addressField]: value,
      },
    }));
  } else {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }
};

const handleCreateCustomer = async (e) => {
  e.preventDefault();

  try {
    setFormLoading(true);
    setFormError("");

    await createCustomer(formData);

    setShowForm(false);

    setFormData({
      name: "",
      phone: "",
      email: "",
      propertyType: "Residential",
      source: "WEBSITE",
      address: {
        street: "",
        city: "",
        state: "",
        pincode: "",
        country: "India",
      },
      notes: "",
      tags: [],
    });

    await fetchCustomers();
  } catch (err) {
    console.error("Error creating customer:", err);
    setFormError(
      err.response?.data?.message || "Failed to create customer."
    );
  } finally {
    setFormLoading(false);
  }
};

  useEffect(() => {
    fetchCustomers();
  }, []);

  const formatDate = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatSource = (source) => {
    if (!source) return "—";

    return source
      .replace(/_/g, " ")
      .toLowerCase()
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const filteredCustomers = customers.filter((customer) => {
    const searchTerm = search.toLowerCase();

    const address = [
      customer.address?.street,
      customer.address?.city,
      customer.address?.state,
      customer.address?.pincode,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      customer.name?.toLowerCase().includes(searchTerm) ||
      customer.email?.toLowerCase().includes(searchTerm) ||
      customer.phone?.includes(searchTerm) ||
      address.toLowerCase().includes(searchTerm) ||
      customer.propertyType?.toLowerCase().includes(searchTerm) ||
      customer.source?.toLowerCase().includes(searchTerm)
    );
  });

  const residentialCount = customers.filter((customer =>
    customer.propertyType?.toLowerCase().includes("residential")
  )).length;

  const apartmentCount = customers.filter((customer =>
    customer.propertyType?.toLowerCase().includes("apartment")
  )).length;

  const uniqueSources = new Set(
    customers.map((customer) => customer.source).filter(Boolean)
  ).size;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <p className="text-slate-500 font-medium">Loading customers...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 p-5 rounded-xl">
        {error}
        <button
          onClick={fetchCustomers}
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
            <h1 className="text-2xl font-bold text-slate-800">Customers</h1>
            <p className="text-sm text-slate-500 mt-1">
            Manage customer information and relationships.
            </p>
        </div>

        <div className="flex gap-3">
            <button
            onClick={fetchCustomers}
            className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
            Refresh
            </button>

            <button
            onClick={() => {
                setShowForm(true);
                setFormError("");
            }}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
            >
            + Add Customer
            </button>
        </div>
        </div>

      {/* Add Customer Form */}
        {showForm && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
            <div>
                <h2 className="text-lg font-semibold text-slate-800">
                Add New Customer
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                Enter the customer details below.
                </p>
            </div>

            <button
                type="button"
                onClick={() => {
                setShowForm(false);
                setFormError("");
                }}
                className="text-slate-400 hover:text-slate-700 text-xl"
            >
                ✕
            </button>
            </div>

            <form onSubmit={handleCreateCustomer} className="space-y-6">
            {/* Basic Information */}
            <div>
                <h3 className="text-sm font-semibold text-slate-700 mb-3">
                Basic Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-slate-600 mb-1">
                    Full Name *
                    </label>
                    <input
                    name="name"
                    value={formData.name}
                    onChange={handleFormChange}
                    required
                    placeholder="Customer full name"
                    className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-600 mb-1">
                    Phone *
                    </label>
                    <input
                    name="phone"
                    value={formData.phone}
                    onChange={handleFormChange}
                    required
                    placeholder="Phone number"
                    className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-600 mb-1">
                    Email
                    </label>
                    <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleFormChange}
                    placeholder="customer@example.com"
                    className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-600 mb-1">
                    Property Type
                    </label>
                    <select
                    name="propertyType"
                    value={formData.propertyType}
                    onChange={handleFormChange}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
                    >
                    <option value="Residential">Residential</option>
                    <option value="Apartment">Apartment</option>
                    <option value="Commercial">Commercial</option>
                    <option value="Office">Office</option>
                    <option value="Other">Other</option>
                    </select>
                </div>
                </div>
            </div>

            {/* Address */}
            <div>
                <h3 className="text-sm font-semibold text-slate-700 mb-3">
                Address
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                    ["address.street", "Street / Area", "Gomti Nagar"],
                    ["address.city", "City", "Lucknow"],
                    ["address.state", "State", "Uttar Pradesh"],
                    ["address.pincode", "PIN Code", "226010"],
                    ["address.country", "Country", "India"],
                ].map(([name, label, placeholder]) => (
                    <div key={name}>
                    <label className="block text-sm font-medium text-slate-600 mb-1">
                        {label}
                    </label>
                    <input
                        name={name}
                        value={formData.address[name.split(".")[1]]}
                        onChange={handleFormChange}
                        placeholder={placeholder}
                        className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                    </div>
                ))}
                </div>
            </div>

            {/* Lead Source */}
            <div>
                <h3 className="text-sm font-semibold text-slate-700 mb-3">
                Lead Source
                </h3>

                <select
                name="source"
                value={formData.source}
                onChange={handleFormChange}
                className="w-full md:w-1/2 border border-slate-200 rounded-lg px-3 py-2.5 text-sm bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                <option value="WEBSITE">Website</option>
                <option value="REFERRAL">Referral</option>
                <option value="SOCIAL_MEDIA">Social Media</option>
                <option value="WALK_IN">Walk In</option>
                <option value="ADVERTISEMENT">Advertisement</option>
                <option value="OTHER">Other</option>
                </select>
            </div>

            {/* Notes */}
            <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">
                Notes
                </label>
                <textarea
                name="notes"
                value={formData.notes}
                onChange={handleFormChange}
                rows="3"
                placeholder="Additional customer information..."
                className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none resize-y"
                />
            </div>

            {/* Error */}
            {formError && (
                <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 text-sm">
                {formError}
                </div>
            )}

            {/* Buttons */}
            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                type="button"
                onClick={() => {
                    setShowForm(false);
                    setFormError("");
                }}
                className="px-4 py-2.5 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                Cancel
                </button>

                <button
                type="submit"
                disabled={formLoading}
                className="px-5 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50"
                >
                {formLoading ? "Creating..." : "Create Customer"}
                </button>
            </div>
            </form>
        </div>
        )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {/* Total Customers */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-sm text-slate-500 font-medium">Total Customers</p>
          <h3 className="text-2xl font-bold text-slate-800 mt-2">
            {customers.length}
          </h3>
          <p className="text-xs text-slate-400 mt-2">All registered customers</p>
        </div>

        {/* Residential */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-sm text-slate-500 font-medium">Residential</p>
          <h3 className="text-2xl font-bold text-blue-600 mt-2">
            {residentialCount}
          </h3>
          <p className="text-xs text-slate-400 mt-2">Residential properties</p>
        </div>

        {/* Apartments */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-sm text-slate-500 font-medium">Apartments</p>
          <h3 className="text-2xl font-bold text-violet-600 mt-2">
            {apartmentCount}
          </h3>
          <p className="text-xs text-slate-400 mt-2">Apartment customers</p>
        </div>

        {/* Sources */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-sm text-slate-500 font-medium">Lead Sources</p>
          <h3 className="text-2xl font-bold text-amber-600 mt-2">
            {uniqueSources}
          </h3>
          <p className="text-xs text-slate-400 mt-2">Different acquisition sources</p>
        </div>
      </div>

      {/* Customer Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        {/* Table Header */}
        <div className="p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="font-semibold text-slate-800">Customer Directory</h2>
            <p className="text-xs text-slate-500 mt-1">
              {filteredCustomers.length} customer(s) found
            </p>
          </div>

          {/* Search */}
          <div className="relative w-full sm:w-72">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name, email, phone..."
              className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-5 py-4 text-left font-semibold text-slate-600">Customer</th>
                <th className="px-5 py-4 text-left font-semibold text-slate-600">Phone</th>
                <th className="px-5 py-4 text-left font-semibold text-slate-600">Address</th>
                <th className="px-5 py-4 text-left font-semibold text-slate-600">Property Type</th>
                <th className="px-5 py-4 text-left font-semibold text-slate-600">Source</th>
                <th className="px-5 py-4 text-left font-semibold text-slate-600">Created</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-12 text-slate-500">
                    {search ? "No customers match your search." : "No customers found."}
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((customer) => (
                  <tr key={customer._id} className="hover:bg-slate-50 transition-colors">
                    {/* Customer */}
                    <td className="px-5 py-4">
                      <div className="font-semibold text-slate-800">
                        {customer.name}
                      </div>
                      <div className="text-xs text-slate-500 mt-1">
                        {customer.email || "No email"}
                      </div>
                    </td>

                    {/* Phone */}
                    <td className="px-5 py-4 text-slate-700">
                      {customer.phone || "—"}
                    </td>

                    {/* Address */}
                    <td className="px-5 py-4 text-slate-600">
                      <div>{customer.address?.street || "—"}</div>
                      <div className="text-xs text-slate-400 mt-1">
                        {[
                          customer.address?.city,
                          customer.address?.state,
                        ].filter(Boolean).join(", ")}
                      </div>
                    </td>

                    {/* Property Type */}
                    <td className="px-5 py-4">
                      <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-violet-50 text-violet-700">
                        {customer.propertyType || "—"}
                      </span>
                    </td>

                    {/* Source */}
                    <td className="px-5 py-4 text-slate-600">
                      {formatSource(customer.source)}
                    </td>

                    {/* Created */}
                    <td className="px-5 py-4 text-slate-600">
                      {formatDate(customer.createdAt)}
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

export default Customers;
