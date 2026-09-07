import express from "express";
import cookieParser from "cookie-parser";

import authRoutes from "./modules/auth/auth.routes.js";
import errorMiddleware from "./middleware/error.middleware.js";

const app = express();

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

app.use(errorMiddleware);

export default app;