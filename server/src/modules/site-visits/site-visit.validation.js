import { z } from "zod";

const addressSchema = z
  .object({
    street: z.string().max(300).optional(),

    city: z.string().max(100).optional(),

    state: z.string().max(100).optional(),

    pincode: z.string().max(20).optional(),

    landmark: z.string().max(200).optional(),
  })
  .optional();

export const createSiteVisitSchema =
  z.object({
    leadId: z.string().optional(),

    customerId: z.string().optional(),

    assignedTo: z.string().optional(),

    scheduledAt: z.string().datetime(),

    address: addressSchema,

    status: z
      .enum([
        "SCHEDULED",
        "CONFIRMED",
        "COMPLETED",
        "CANCELLED",
        "RESCHEDULED",
      ])
      .optional(),

    notes: z
      .string()
      .max(3000)
      .optional(),

    findings: z
      .string()
      .max(5000)
      .optional(),

    nextAction: z
      .string()
      .max(1000)
      .optional(),
  });

export const updateSiteVisitSchema =
  createSiteVisitSchema.partial();