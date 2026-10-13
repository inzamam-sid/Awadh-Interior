
import { z } from "zod";

const quotationItemSchema = z.object({
  description: z.string().trim().min(2).max(300),
  category: z.string().trim().optional(),
  quantity: z.number().positive(),
  unit: z.string().trim().min(1).max(50),
  rate: z.number().min(0),
});

export const createQuotationSchema = z.object({
  customerId: z.string().min(1),
  projectId: z.string().optional(),
  leadId: z.string().optional(),

  items: z.array(quotationItemSchema).min(1),

  discount: z.number().min(0).optional().default(0),
  taxRate: z.number().min(0).max(100).optional().default(0),

  terms: z.string().max(5000).optional().default(""),
  validUntil: z.coerce.date().optional(),
});

export const updateQuotationSchema = z.object({
  customerId: z.string().min(1).optional(),
  projectId: z.string().nullable().optional(),
  leadId: z.string().nullable().optional(),

  items: z.array(quotationItemSchema).min(1).optional(),

  discount: z.number().min(0).optional(),
  taxRate: z.number().min(0).max(100).optional(),

  terms: z.string().max(5000).optional(),
  validUntil: z.coerce.date().nullable().optional(),
});
