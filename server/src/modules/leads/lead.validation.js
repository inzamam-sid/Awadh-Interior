import { z } from "zod";

const optionalNumber = z
  .number()
  .min(0)
  .nullable()
  .optional();

export const createLeadSchema = z.object({
  name: z
    .string()
    .min(2)
    .max(100),

  phone: z
    .string()
    .min(10)
    .max(15),

  email: z
    .string()
    .email()
    .optional()
    .or(z.literal("")),

  source: z
    .enum([
      "WEBSITE",
      "WHATSAPP",
      "PHONE",
      "INSTAGRAM",
      "FACEBOOK",
      "REFERRAL",
      "WALK_IN",
      "OTHER",
    ])
    .optional(),

  requirement: z
    .object({
      projectType: z.string().max(100).optional(),
      roomType: z.string().max(100).optional(),
      ceilingType: z.string().max(100).optional(),
      designStyle: z.string().max(100).optional(),
      area: optionalNumber,
      lighting: z.string().max(100).optional(),
      description: z.string().max(2000).optional(),
    })
    .optional(),

  budget: z
    .object({
      min: optionalNumber,
      max: optionalNumber,
    })
    .optional(),

  property: z
    .object({
      type: z.string().max(100).optional(),
      address: z.string().max(500).optional(),
      city: z.string().max(100).optional(),
      state: z.string().max(100).optional(),
    })
    .optional(),

  notes: z
    .string()
    .max(3000)
    .optional(),

  assignedTo: z
    .string()
    .optional(),
});

export const updateLeadSchema =
  createLeadSchema
    .partial()
    .extend({
      status: z
        .enum([
          "NEW",
          "CONTACTED",
          "QUALIFIED",
          "SITE_VISIT",
          "QUOTATION",
          "NEGOTIATION",
          "WON",
          "LOST",
        ])
        .optional(),

      lostReason: z
        .string()
        .max(1000)
        .optional(),
    });