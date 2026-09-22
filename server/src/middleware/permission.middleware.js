import ApiError from "../utils/api-error.js";
import { ROLE_PERMISSIONS } from "../config/role-permissions.js";

export const requirePermission = (permission) => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        throw new ApiError(
          401,
          "AUTHENTICATION_REQUIRED",
          "Authentication is required."
        );
      }

      const role = req.user.role;

      const permissions =
        ROLE_PERMISSIONS[role];

      if (!permissions) {
        throw new ApiError(
          403,
          "INVALID_ROLE",
          "User role is not configured."
        );
      }

      if (!permissions.includes(permission)) {
        throw new ApiError(
          403,
          "PERMISSION_DENIED",
          "You do not have permission to perform this action."
        );
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};


export const requireAllPermissions = (
  requiredPermissions
) => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        throw new ApiError(
          401,
          "AUTHENTICATION_REQUIRED",
          "Authentication is required."
        );
      }

      const role = req.user.role;

      const permissions =
        ROLE_PERMISSIONS[role];

      if (!permissions) {
        throw new ApiError(
          403,
          "INVALID_ROLE",
          "User role is not configured."
        );
      }

      const hasAllPermissions =
        requiredPermissions.every(
          (permission) =>
            permissions.includes(permission)
        );

      if (!hasAllPermissions) {
        throw new ApiError(
          403,
          "PERMISSION_DENIED",
          "You do not have permission to perform this action."
        );
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

export default requirePermission;