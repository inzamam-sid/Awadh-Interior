
import { useEffect, useState } from "react";
import {
  FolderKanban,
  Users,
  FileText,
  Wallet,
  Receipt,
  CalendarDays,
  Clock,
  CheckCircle2,
  CircleDollarSign,
  BriefcaseBusiness,
} from "lucide-react";

import { getDashboardData } from "../services/dashboardService";

const formatCurrency = (amount = 0) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(amount);

const formatDate = (date) =>
  new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

const getProjectStatusStyle = (status) => {
  const styles = {
    COMPLETED: "bg-green-100 text-green-700",
    IN_PROGRESS: "bg-blue-100 text-blue-700",
    PLANNING: "bg-amber-100 text-amber-700",
    UPCOMING: "bg-purple-100 text-purple-700",
    ON_HOLD: "bg-orange-100 text-orange-700",
    CANCELLED: "bg-red-100 text-red-700",
  };

  return styles[status] || "bg-slate-100 text-slate-700";
};

const getActivityIcon = (type) => {
  switch (type) {
    case "PROJECT_CREATED":
      return FolderKanban;
    case "QUOTATION_CREATED":
      return FileText;
    case "INVOICE_CREATED":
      return Receipt;
    case "PAYMENT_RECEIVED":
      return CircleDollarSign;
    default:
      return Clock;
  }
};

function Dashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        const data = await getDashboardData();
        setDashboardData(data);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
        setError(
          err.response?.data?.message || "Failed to load dashboard data."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  const stats = [
    {
      title: "Total Projects",
      value: dashboardData?.totalProjects ?? 0,
      icon: FolderKanban,
      color: "bg-blue-100 text-blue-700",
    },
    {
      title: "Total Customers",
      value: dashboardData?.totalCustomers ?? 0,
      icon: Users,
      color: "bg-green-100 text-green-700",
    },
    {
      title: "Quotations",
      value: dashboardData?.totalQuotations ?? 0,
      icon: FileText,
      color: "bg-amber-100 text-amber-700",
    },
    {
      title: "Total Invoices",
      value: dashboardData?.totalInvoices ?? 0,
      icon: Receipt,
      color: "bg-pink-100 text-pink-700",
    },
    {
      title: "Total Revenue",
      value: formatCurrency(dashboardData?.totalRevenue ?? 0),
      icon: Wallet,
      color: "bg-purple-100 text-purple-700",
    },
  ];

  if (loading) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-awadh-gold" />
          <p className="mt-4 text-sm text-slate-500">
            Loading dashboard...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
        <p className="font-semibold text-red-700">
          Unable to load dashboard
        </p>
        <p className="mt-2 text-sm text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-awadh-navy">
            Welcome back, Mohammad Nafees!
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Here's what's happening with your business today.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-lg border bg-white px-4 py-2 text-sm text-slate-600">
          <CalendarDays size={18} />
          Business Overview
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-5">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.title}
              className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm text-slate-500">{stat.title}</p>
                  <h2 className="mt-2 text-2xl font-bold text-awadh-navy">
                    {stat.value}
                  </h2>
                </div>

                <div className={`rounded-xl p-3 ${stat.color}`}>
                  <Icon size={23} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Projects & Recent Activity */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* Recent Projects */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm xl:col-span-2">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="font-bold text-awadh-navy">
                Recent Projects
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                Overview of your latest projects
              </p>
            </div>

            <button className="text-sm font-semibold text-awadh-gold hover:underline">
              View All
            </button>
          </div>

          <div className="space-y-6">
            {dashboardData?.recentProjects?.length > 0 ? (
              dashboardData.recentProjects.map((project) => (
                <div key={project._id}>
                  <div className="mb-2 flex flex-col justify-between gap-2 sm:flex-row">
                    <div>
                      <h3 className="text-sm font-semibold text-slate-800">
                        {project.name}
                      </h3>
                      <p className="mt-1 text-xs text-slate-500">
                        {project.projectCode} •{" "}
                        {project.customerId?.name || "Unknown Customer"}
                      </p>
                    </div>

                    <span
                      className={`h-fit w-fit rounded-full px-3 py-1 text-xs font-medium ${getProjectStatusStyle(
                        project.status
                      )}`}
                    >
                      {project.status?.replace(/_/g, " ")}
                    </span>
                  </div>

                  <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-awadh-gold transition-all duration-500"
                      style={{
                        width: `${project.progress || 0}%`,
                      }}
                    />
                  </div>

                  <p className="mt-1 text-right text-xs text-slate-500">
                    {project.progress || 0}% completed
                  </p>
                </div>
              ))
            ) : (
              <div className="py-8 text-center text-sm text-slate-500">
                No projects found.
              </div>
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="font-bold text-awadh-navy">Recent Activity</h2>
          <p className="mt-1 text-xs text-slate-500">
            Latest business updates
          </p>

          <div className="mt-6 space-y-5">
            {dashboardData?.recentActivity?.length > 0 ? (
              dashboardData.recentActivity.map((activity, index) => {
                const Icon = getActivityIcon(activity.type);

                return (
                  <div key={activity.referenceId || index} className="flex gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-amber-100 text-awadh-gold">
                      <Icon size={18} />
                    </div>

                    <div className="min-w-0">
                      <h3 className="text-sm font-semibold text-slate-800">
                        {activity.title}
                      </h3>

                      <p className="mt-1 break-words text-xs text-slate-500">
                        {activity.description}
                      </p>

                      {activity.customerName && (
                        <p className="mt-1 text-xs text-slate-500">
                          {activity.customerName}
                        </p>
                      )}

                      {activity.amount !== undefined && (
                        <p className="mt-1 text-xs font-medium text-green-700">
                          {formatCurrency(activity.amount)}
                        </p>
                      )}

                      <p className="mt-1 text-[11px] text-slate-400">
                        {formatDate(activity.date)}
                      </p>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="py-8 text-center text-sm text-slate-500">
                No recent activity.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Invoices */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="font-bold text-awadh-navy">Recent Invoices</h2>
            <p className="mt-1 text-xs text-slate-500">
              Latest invoices and payment status
            </p>
          </div>

          <button className="text-sm font-semibold text-awadh-gold hover:underline">
            View All
          </button>
        </div>

        <div className="space-y-4">
          {dashboardData?.recentInvoices?.length > 0 ? (
            dashboardData.recentInvoices.map((invoice) => (
              <div
                key={invoice._id}
                className="flex flex-col justify-between gap-3 rounded-lg border border-slate-100 p-4 sm:flex-row sm:items-center"
              >
                <div>
                  <h3 className="text-sm font-semibold text-slate-800">
                    {invoice.invoiceNumber}
                  </h3>
                  <p className="mt-1 text-xs text-slate-500">
                    {invoice.customerId?.name || "Unknown Customer"}
                  </p>
                  <p className="mt-1 text-xs text-slate-400">
                    Issued: {formatDate(invoice.issueDate)}
                  </p>
                </div>

                <div className="sm:text-right">
                  <p className="font-semibold text-awadh-navy">
                    {formatCurrency(invoice.total)}
                  </p>

                  <span
                    className={`mt-2 inline-block rounded-full px-3 py-1 text-xs font-medium ${
                      invoice.status === "PAID"
                        ? "bg-green-100 text-green-700"
                        : invoice.status === "OVERDUE"
                        ? "bg-red-100 text-red-700"
                        : invoice.status === "PARTIALLY_PAID"
                        ? "bg-amber-100 text-amber-700"
                        : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {invoice.status?.replace(/_/g, " ")}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="py-8 text-center text-sm text-slate-500">
              No invoices found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
