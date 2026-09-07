import { ZodError } from "zod";

const errorMiddleware = (
  error,
  req,
  res,
  next
) => {
  console.error(error);

  if (error instanceof ZodError) {
    return res.status(400).json({
      success: false,
      error: {
        code: "VALIDATION_ERROR",
        message: "Invalid request data.",
        details: error.issues,
      },
    });
  }

  const statusCode =
    error.statusCode || 500;

  res.status(statusCode).json({
    success: false,
    error: {
      code:
        error.code || "INTERNAL_SERVER_ERROR",

      message:
        error.message ||
        "Something went wrong.",
    },
  });
};

export default errorMiddleware;