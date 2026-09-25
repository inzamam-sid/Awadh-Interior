import { z } from "zod";

const locationSchema = z
  .object({
    street: z.string().max(300).optional(),

    city: z.string().max(100).optional(),

    state: z.string().max(100).optional(),

    pincode: z.string().max(20).optional(),
  })
  .optional();

export const createProjectSchema =
  z.object({
    customerId: z.string(),

    leadId: z.string().optional(),

    quotationId: z.string().optional(),

    name: z
      .string()
      .min(2)
      .max(200),

    projectCode: z
      .string()
      .min(2)
      .max(50),

    projectType: z
      .string()
      .min(2)
      .max(100),

    description: z
      .string()
      .max(5000)
      .optional(),

    location: locationSchema,

    area: z
      .number()
      .min(0)
      .nullable()
      .optional(),

    budget: z
      .number()
      .min(0)
      .nullable()
      .optional(),

    startDate: z
      .string()
      .datetime()
      .optional(),

    expectedEndDate: z
      .string()
      .datetime()
      .optional(),

    status: z
      .enum([
        "PLANNING",
        "UPCOMING",
        "IN_PROGRESS",
        "ON_HOLD",
        "COMPLETED",
        "CANCELLED",
      ])
      .optional(),

    progress: z
      .number()
      .min(0)
      .max(100)
      .optional(),

    projectManagerId:
      z.string().optional(),

    assignedEmployees:
      z.array(z.string()).optional(),

    notes: z
      .string()
      .max(5000)
      .optional(),
  });

export const updateProjectSchema =
  createProjectSchema.partial();