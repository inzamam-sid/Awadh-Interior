import { z } from "zod";

export const createProgressSchema =
  z.object({
    milestoneId:
      z.string().optional(),

    description: z
      .string()
      .min(2)
      .max(5000),

    images: z
      .array(z.string())
      .optional(),

    videos: z
      .array(z.string())
      .optional(),

    visibleToCustomer:
      z.boolean().optional(),
  });

export const updateProgressSchema =
  z.object({
    description: z
      .string()
      .min(2)
      .max(5000)
      .optional(),

    images: z
      .array(z.string())
      .optional(),

    videos: z
      .array(z.string())
      .optional(),

    visibleToCustomer:
      z.boolean().optional(),
  });