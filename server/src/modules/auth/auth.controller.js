import User from "./user.model.js";

import {
  setupOwner,
  login,
  refreshAccessToken,
  logout,
} from "./auth.service.js";

import {
  setupOwnerSchema,
  loginSchema,
} from "./auth.validation.js";

import ApiError from "../../utils/api-error.js";


// ======================================================
// SETUP OWNER
// ======================================================

export const setupOwnerController = async (
  req,
  res,
  next
) => {
  try {
    const data =
      setupOwnerSchema.parse(req.body);

    const result =
      await setupOwner(data);

    res.status(201).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};


// ======================================================
// LOGIN
// ======================================================

export const loginController = async (
  req,
  res,
  next
) => {
  try {
    const data =
      loginSchema.parse(req.body);

    const result =
      await login(data);

    res.cookie(
      "refreshToken",
      result.refreshToken,
      {
        httpOnly: true,

        secure:
          process.env.NODE_ENV ===
          "production",

        sameSite:
          process.env.NODE_ENV ===
          "production"
            ? "none"
            : "lax",

        maxAge:
          7 * 24 * 60 * 60 * 1000,
      }
    );

    res.status(200).json({
      success: true,
      data: {
        accessToken:
          result.accessToken,

        user: result.user,
      },
    });
  } catch (error) {
    next(error);
  }
};


// ======================================================
// REFRESH
// ======================================================

export const refreshController = async (
  req,
  res,
  next
) => {
  try {
    const refreshToken =
      req.cookies.refreshToken;

    if (!refreshToken) {
      throw new ApiError(
        401,
        "REFRESH_TOKEN_REQUIRED",
        "Refresh token is required."
      );
    }

    const result =
      await refreshAccessToken(
        refreshToken
      );

    res.cookie(
      "refreshToken",
      result.refreshToken,
      {
        httpOnly: true,

        secure:
          process.env.NODE_ENV ===
          "production",

        sameSite:
          process.env.NODE_ENV ===
          "production"
            ? "none"
            : "lax",

        maxAge:
          7 * 24 * 60 * 60 * 1000,
      }
    );

    res.status(200).json({
      success: true,
      data: {
        accessToken:
          result.accessToken,
      },
    });
  } catch (error) {
    next(error);
  }
};


// ======================================================
// LOGOUT
// ======================================================

export const logoutController = async (
  req,
  res,
  next
) => {
  try {
    const refreshToken =
      req.cookies.refreshToken;

    await logout(refreshToken);

    res.clearCookie(
      "refreshToken",
      {
        httpOnly: true,

        secure:
          process.env.NODE_ENV ===
          "production",

        sameSite:
          process.env.NODE_ENV ===
          "production"
            ? "none"
            : "lax",
      }
    );

    res.status(200).json({
      success: true,
      data: {
        message:
          "Logged out successfully.",
      },
    });
  } catch (error) {
    next(error);
  }
};


// ======================================================
// GET CURRENT USER
// ======================================================

export const getMeController = async (
  req,
  res,
  next
) => {
  try {
    const user = await User.findOne({
      _id: req.user.userId,
      organizationId:
        req.user.organizationId,
      isActive: true,
    });

    if (!user) {
      throw new ApiError(
        401,
        "USER_INACTIVE",
        "User account is inactive."
      );
    }

    res.status(200).json({
      success: true,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        organizationId:
          user.organizationId,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    next(error);
  }
};