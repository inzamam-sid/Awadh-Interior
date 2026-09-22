import { z } from "zod";

export const createCustomerSchema =
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

        country: z
          .string()
          .max(100)
          .optional(),
      })
      .optional(),

    propertyType: z
      .string()
      .max(100)
      .optional(),

    source: z
      .string()
      .max(100)
      .optional(),

    notes: z
      .string()
      .max(3000)
      .optional(),

    tags: z
      .array(
        z.string().max(50)
      )
      .optional(),
  });

export const updateCustomerSchema =
  createCustomerSchema.partial();