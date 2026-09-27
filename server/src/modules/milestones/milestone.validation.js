import { z } from "zod";

export const createMilestoneSchema =
  z.object({
    title: z
      .string()
      .min(2)
      .max(200),

    description: z
      .string()
      .max(5000)
      .optional(),

    order: z
      .number()
      .int()
      .min(1),

    status: z
      .enum([
        "PENDING",
        "IN_PROGRESS",
        "COMPLETED",
        "SKIPPED",
      ])
      .optional(),

    startDate: z
      .string()
      .datetime()
      .optional(),

    dueDate: z
      .string()
      .datetime()
      .optional(),
  });

export const updateMilestoneSchema =
  createMilestoneSchema.partial();