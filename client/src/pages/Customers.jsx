
import { useEffect, useState } from "react";
import { getCustomers } from "../services/customerService";

function Customers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

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

        <button
          onClick={fetchCustomers}
          className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          Refresh
        </button>
      </div>

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
