import Project from "../projects/project.model.js";
import Customer from "../customers/customer.model.js";
import Quotation from "../quotations/quotation.model.js";
import Invoice from "../invoices/invoice.model.js";
import Payment from "../payments/payment.model.js";

export const getDashboardStats = async (organizationId) => {
  const [
    totalProjects,
    totalCustomers,
    totalQuotations,
    totalInvoices,
    invoices,
    recentProjects,
    recentInvoices,
    recentQuotations,
    recentPayments,
  ] = await Promise.all([
    Project.countDocuments({ organizationId }),

    Customer.countDocuments({ organizationId }),

    Quotation.countDocuments({ organizationId }),

    Invoice.countDocuments({ organizationId }),

    Invoice.find({ organizationId }).select(
      "total amountPaid balanceDue status"
    ),

    Project.find({ organizationId })
      .populate("customerId", "name")
      .select("name projectCode status progress customerId createdAt")
      .sort({ createdAt: -1 })
      .limit(5),

    Invoice.find({ organizationId })
      .populate("customerId", "name")
      .select(
        "invoiceNumber customerId total amountPaid balanceDue status issueDate dueDate createdAt"
      )
      .sort({ createdAt: -1 })
      .limit(5),

    Quotation.find({ organizationId })
      .populate("customerId", "name")
      .select("quotationNumber customerId total status createdAt")
      .sort({ createdAt: -1 })
      .limit(5),

    Payment.find({ organizationId })
      .populate("customerId", "name")
      .select("paymentNumber customerId amount paymentMethod paymentDate createdAt")
      .sort({ paymentDate: -1 })
      .limit(5),
  ]);

  const totalRevenue = invoices.reduce(
    (sum, invoice) => sum + invoice.amountPaid,
    0
  );

  // Project activities
  const projectActivities = recentProjects.map((project) => ({
    type: "PROJECT_CREATED",
    title: "Project created",
    description: project.name,
    customerName: project.customerId?.name || "Unknown customer",
    date: project.createdAt,
    referenceId: project._id,
  }));

  // Quotation activities
  const quotationActivities = recentQuotations.map((quotation) => ({
    type: "QUOTATION_CREATED",
    title: "Quotation created",
    description: quotation.quotationNumber,
    customerName: quotation.customerId?.name || "Unknown customer",
    amount: quotation.total,
    status: quotation.status,
    date: quotation.createdAt,
    referenceId: quotation._id,
  }));

  // Invoice activities
  const invoiceActivities = recentInvoices.map((invoice) => ({
    type: "INVOICE_CREATED",
    title: "Invoice created",
    description: invoice.invoiceNumber,
    customerName: invoice.customerId?.name || "Unknown customer",
    amount: invoice.total,
    status: invoice.status,
    date: invoice.createdAt,
    referenceId: invoice._id,
  }));

  // Payment activities
  const paymentActivities = recentPayments.map((payment) => ({
    type: "PAYMENT_RECEIVED",
    title: "Payment received",
    description: `${payment.paymentNumber} • ${payment.paymentMethod}`,
    customerName: payment.customerId?.name || "Unknown customer",
    amount: payment.amount,
    date: payment.paymentDate,
    referenceId: payment._id,
  }));

  // Combine and sort activities
  const recentActivity = [
    ...projectActivities,
    ...quotationActivities,
    ...invoiceActivities,
    ...paymentActivities,
  ]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 10);

  return {
    totalProjects,
    totalCustomers,
    totalQuotations,
    totalInvoices,
    totalRevenue,
    recentProjects,
    recentInvoices,
    recentActivity,
  };
};