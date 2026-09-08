import ApiError from "../utils/api-error.js";
import { verifyAccessToken } from "../utils/jwt.js";

const authMiddleware = (req, res, next) => {
  try {
    const authorization = req.headers.authorization;

    if (!authorization) {
      throw new ApiError(
        401,
        "AUTHENTICATION_REQUIRED",
        "Authentication is required."
      );
    }

    const [scheme, token] = authorization.split(" ");

    if (scheme !== "Bearer" || !token) {
      throw new ApiError(
        401,
        "INVALID_AUTH_HEADER",
        "Invalid authorization header."
      );
    }

    const decoded = verifyAccessToken(token);

    req.user = decoded;

    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return next(
        new ApiError(
          401,
          "INVALID_ACCESS_TOKEN",
          "Invalid access token."
        )
      );
    }

    if (error.name === "TokenExpiredError") {
      return next(
        new ApiError(
          401,
          "ACCESS_TOKEN_EXPIRED",
          "Access token has expired."
        )
      );
    }

    next(error);
  }
};

export default authMiddleware;