import bcrypt from "bcryptjs";

import User from "./user.model.js";
import Organization from "../organizations/organization.model.js";
import RefreshToken from "./refresh-token.model.js";

import ApiError from "../../utils/api-error.js";

import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  hashToken,
} from "../../utils/jwt.js";


// ======================================================
// SETUP OWNER
// ======================================================

export const setupOwner = async ({
  organizationName,
  organizationSlug,
  name,
  email,
  phone,
  password,
}) => {
  const existingOrganization =
    await Organization.findOne({
      slug: organizationSlug,
    });

  if (existingOrganization) {
    throw new ApiError(
      409,
      "ORGANIZATION_EXISTS",
      "Organization already exists."
    );
  }

  const passwordHash =
    await bcrypt.hash(password, 12);

  const organization =
    await Organization.create({
      name: organizationName,
      slug: organizationSlug,
    });

  const user = await User.create({
    organizationId: organization._id,
    name,
    email,
    phone,
    passwordHash,
    role: "OWNER",
  });

  return {
    organization: {
      id: organization._id,
      name: organization.name,
      slug: organization.slug,
    },

    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
};


// ======================================================
// LOGIN
// ======================================================

export const login = async ({
  email,
  password,
}) => {
  const user = await User.findOne({
    email,
  }).select("+passwordHash");

  if (!user) {
    throw new ApiError(
      401,
      "INVALID_CREDENTIALS",
      "Invalid email or password."
    );
  }

  if (!user.isActive) {
    throw new ApiError(
      403,
      "USER_INACTIVE",
      "This account is inactive."
    );
  }

  const passwordMatches =
    await bcrypt.compare(
      password,
      user.passwordHash
    );

  if (!passwordMatches) {
    throw new ApiError(
      401,
      "INVALID_CREDENTIALS",
      "Invalid email or password."
    );
  }

  user.lastLoginAt = new Date();

  await user.save();

  const tokenPayload = {
    userId: user._id.toString(),
    organizationId:
      user.organizationId.toString(),
    role: user.role,
  };

  const accessToken =
    generateAccessToken(tokenPayload);

  const refreshToken =
    generateRefreshToken(tokenPayload);

  const refreshTokenHash =
    hashToken(refreshToken);

  await RefreshToken.create({
    userId: user._id,
    organizationId:
      user.organizationId,
    tokenHash: refreshTokenHash,
    expiresAt: new Date(
      Date.now() +
        7 * 24 * 60 * 60 * 1000
    ),
  });

  return {
    accessToken,
    refreshToken,

    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      organizationId:
        user.organizationId,
    },
  };
};


// ======================================================
// REFRESH ACCESS TOKEN
// ======================================================

export const refreshAccessToken =
  async (refreshToken) => {
    let decoded;

    try {
      decoded =
        verifyRefreshToken(refreshToken);
    } catch (error) {
      throw new ApiError(
        401,
        "INVALID_REFRESH_TOKEN",
        "Invalid or expired refresh token."
      );
    }

    const tokenHash =
      hashToken(refreshToken);

    const storedToken =
      await RefreshToken.findOne({
        tokenHash,
        userId: decoded.userId,
        organizationId:
          decoded.organizationId,
        revokedAt: null,
      });

    if (!storedToken) {
      throw new ApiError(
        401,
        "REFRESH_TOKEN_REVOKED",
        "Refresh token is no longer valid."
      );
    }

    if (
      storedToken.expiresAt < new Date()
    ) {
      throw new ApiError(
        401,
        "REFRESH_TOKEN_EXPIRED",
        "Refresh token has expired."
      );
    }

    const user = await User.findOne({
      _id: decoded.userId,
      organizationId:
        decoded.organizationId,
    });

    if (!user || !user.isActive) {
      throw new ApiError(
        401,
        "USER_INACTIVE",
        "User account is inactive."
      );
    }

    // Revoke old refresh token
    storedToken.revokedAt =
      new Date();

    await storedToken.save();

    const tokenPayload = {
      userId: user._id.toString(),
      organizationId:
        user.organizationId.toString(),
      role: user.role,
    };

    const newAccessToken =
      generateAccessToken(
        tokenPayload
      );

    const newRefreshToken =
      generateRefreshToken(
        tokenPayload
      );

    await RefreshToken.create({
      userId: user._id,
      organizationId:
        user.organizationId,
      tokenHash:
        hashToken(newRefreshToken),
      expiresAt: new Date(
        Date.now() +
          7 * 24 * 60 * 60 * 1000
      ),
    });

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  };


// ======================================================
// LOGOUT
// ======================================================

export const logout = async (
  refreshToken
) => {
  if (!refreshToken) {
    return;
  }

  const tokenHash =
    hashToken(refreshToken);

  await RefreshToken.findOneAndUpdate(
    {
      tokenHash,
      revokedAt: null,
    },
    {
      revokedAt: new Date(),
    }
  );
};