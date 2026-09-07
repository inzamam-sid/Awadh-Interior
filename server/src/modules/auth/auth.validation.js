import { z } from "zod";

export const setupOwnerSchema = z.object({
  organizationName: z
    .string()
    .min(2)
    .max(100),

  organizationSlug: z
    .string()
    .min(2)
    .max(100)
    .regex(
      /^[a-z0-9-]+$/,
      "Slug can only contain lowercase letters, numbers and hyphens."
    ),

  name: z
    .string()
    .min(2)
    .max(100),

  email: z
    .string()
    .email(),

  phone: z
    .string()
    .min(10)
    .max(15),

  password: z
    .string()
    .min(8)
    .max(100),
});

export const loginSchema = z.object({
  email: z
    .string()
    .email(),

  password: z
    .string()
    .min(1),
});