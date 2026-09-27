import { z } from "zod";

export const createTaskSchema =
  z.object({
    title: z
      .string()
      .min(2)
      .max(200),

    description: z
      .string()
      .max(5000)
      .optional(),

    assignedTo:
      z.string().optional(),

    priority: z
      .enum([
        "LOW",
        "MEDIUM",
        "HIGH",
        "URGENT",
      ])
      .optional(),

    status: z
      .enum([
        "TODO",
        "IN_PROGRESS",
        "COMPLETED",
        "CANCELLED",
      ])
      .optional(),

    dueDate: z
      .string()
      .datetime()
      .optional(),

    notes: z
      .string()
      .max(3000)
      .optional(),
  });

export const updateTaskSchema =
  createTaskSchema.partial();