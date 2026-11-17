
import { z } from "zod";

const invoiceItemSchema = z.object({
  description: z.string().min(1, "Description is required"),

  category: z.string().optional().default(""),

  quantity: z.coerce.number().positive(
    "Quantity must be greater than zero"
  ),

  unit: z.string().optional().default("unit"),

  rate: z.coerce.number().min(0, "Rate cannot be negative"),
});

export const createInvoiceSchema = z.object({
  body: z.object({
    quotationId: z.string().regex(
      /^[0-9a-fA-F]{24}$/,
      "Invalid quotation ID"
    ),

    dueDate: z.coerce.date(),

    notes: z.string().optional().default(""),
  }),
});

export const updateInvoiceSchema = z.object({
  body: z.object({
    dueDate: z.coerce.date().optional(),

    notes: z.string().optional(),

    status: z.enum([
      "DRAFT",
      "ISSUED",
    ]).optional(),
  }),
});
