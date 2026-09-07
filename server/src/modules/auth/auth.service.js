import bcrypt from "bcryptjs";

import User from "./user.model.js";
import Organization from "../organizations/organization.model.js";

import ApiError from "../../utils/api-error.js";

import {
  generateAccessToken,
  generateRefreshToken,
} from "../../utils/jwt.js";


export const setupOwner = async ({
  organizationName,
  organizationSlug,
  name,
  email,
  phone,
  password,
}) => {
  const existingOrganization = await Organization.findOne({
    slug: organizationSlug,
  });

  if (existingOrganization) {
    throw new ApiError(
      409,
      "ORGANIZATION_EXISTS",
      "Organization already exists."
    );
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const organization = await Organization.create({
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


export const login = async ({ email, password }) => {
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

  const passwordMatches = await bcrypt.compare(
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
    organizationId: user.organizationId.toString(),
    role: user.role,
  };

  const accessToken = generateAccessToken(
    tokenPayload
  );

  const refreshToken = generateRefreshToken(
    tokenPayload
  );

  return {
    accessToken,
    refreshToken,

    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      organizationId: user.organizationId,
    },
  };
};