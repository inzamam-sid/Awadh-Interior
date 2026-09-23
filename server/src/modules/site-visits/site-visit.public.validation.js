import { z } from "zod";

export const publicSiteVisitSchema =
  z.object({
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

    scheduledAt: z
      .string()
      .datetime(),

    propertyType: z
      .string()
      .max(100)
      .optional(),

    address: z
      .object({
        street: z
          .string()
          .max(300)
          .optional(),

        city: z
          .string()
          .max(100)
          .optional(),

        state: z
          .string()
          .max(100)
          .optional(),

        pincode: z
          .string()
          .max(20)
          .optional(),

        landmark: z
          .string()
          .max(200)
          .optional(),
      })
      .optional(),

    requirement: z
      .string()
      .max(2000)
      .optional(),
  });