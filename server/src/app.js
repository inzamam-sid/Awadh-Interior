import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import authRoutes from "./modules/auth/auth.routes.js";
import errorMiddleware from "./middleware/error.middleware.js";
import leadRoutes from "./modules/leads/lead.routes.js";
import customerRoutes from "./modules/customers/customer.routes.js";
import siteVisitRoutes from "./modules/site-visits/site-visit.routes.js";
import publicSiteVisitRoutes from "./modules/site-visits/site-visit.public.routes.js";
import employeeRoutes from "./modules/employees/employee.routes.js";
import projectRoutes from "./modules/projects/project.routes.js";
import taskRoutes from "./modules/tasks/task.routes.js";
import milestoneRoutes from "./modules/milestones/milestone.routes.js";
import progressRoutes from "./modules/progress/progress.routes.js";
import quotationRoutes from "./modules/quotations/quotation.routes.js";
import invoiceRoutes from "./modules/invoices/invoice.routes.js";
import paymentRoutes from "./modules/payments/payment.routes.js";
import dashboardRoutes from "./modules/dashboard/dashboard.routes.js";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: [
      "GET",
      "HEAD",
      "POST",
      "PUT",
      "PATCH",
      "DELETE",
      "OPTIONS",
    ],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
    ],
    optionsSuccessStatus: 204,
  })
);

app.use(express.json());
app.use(cookieParser());

app.get("/api/v1/health", (req, res) => {
  res.json({
    success: true,
    message: "Awadh Interior API is running",
  });
});

app.use(
  "/api/v1/auth",
  authRoutes
);

app.use(
  "/api/v1/leads",
  leadRoutes
);

app.use(
  "/api/v1/customers",
  customerRoutes
);

app.use(
  "/api/v1/site-visits",
  siteVisitRoutes
);

app.use(
  "/api/v1/public",
  publicSiteVisitRoutes
);

app.use(
  "/api/v1/employees",
  employeeRoutes
);

app.use(
  "/api/v1/projects",
  projectRoutes
);

app.use(
  "/api/v1/tasks",
  taskRoutes
);

app.use(
  "/api/v1/milestones",
  milestoneRoutes
);

app.use(
  "/api/v1/progress",
  progressRoutes
);

app.use(
  "/api/v1/quotations", 
  quotationRoutes
);

app.use(
  "/api/v1/invoices", 
  invoiceRoutes
);

app.use(
  "/api/v1/payments", 
  paymentRoutes
);

app.use(
  "/api/v1/dashboard", 
  dashboardRoutes
);

app.use(errorMiddleware);

export default app;