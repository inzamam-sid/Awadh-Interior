import {
  setupOwner,
  login,
} from "./auth.service.js";

import {
  setupOwnerSchema,
  loginSchema,
} from "./auth.validation.js";

export const setupOwnerController = async (
  req,
  res,
  next
) => {
  try {
    const data = setupOwnerSchema.parse(req.body);

    const result = await setupOwner(data);

    res.status(201).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const loginController = async (
  req,
  res,
  next
) => {
  try {
    const data = loginSchema.parse(req.body);

    const result = await login(data);

    res.cookie(
      "refreshToken",
      result.refreshToken,
      {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite:
          process.env.NODE_ENV === "production"
            ? "none"
            : "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      }
    );

    res.status(200).json({
      success: true,
      data: {
        accessToken: result.accessToken,
        user: result.user,
      },
    });
  } catch (error) {
    next(error);
  }
};