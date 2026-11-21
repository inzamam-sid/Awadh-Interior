import Project from "../projects/project.model.js";
import Customer from "../customers/customer.model.js";
import Quotation from "../quotations/quotation.model.js";
import Invoice from "../invoices/invoice.model.js";

export const getDashboardStats = async (organizationId) => {
  const [
    totalProjects,
    totalCustomers,
    totalQuotations,
    totalInvoices,
    invoices,
  ] = await Promise.all([
    Project.countDocuments({ organizationId }),
    Customer.countDocuments({ organizationId }),
    Quotation.countDocuments({ organizationId }),
    Invoice.countDocuments({ organizationId }),
    Invoice.find({ organizationId }).select("total amountPaid balanceDue status"),
  ]);

  const totalRevenue = invoices.reduce(
    (sum, invoice) => sum + invoice.amountPaid,
    0
  );

  return {
    totalProjects,
    totalCustomers,
    totalQuotations,
    totalInvoices,
    totalRevenue,
  };
};