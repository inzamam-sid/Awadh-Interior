
import { z } from "zod";

export const createPaymentSchema = z.object({
  body: z.object({
    invoiceId: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/, "Invalid invoice ID"),

    amount: z.coerce
      .number()
      .positive("Payment amount must be greater than zero"),

    paymentMethod: z.enum([
      "CASH",
      "UPI",
      "BANK_TRANSFER",
      "CHEQUE",
    ]),

    paymentDate: z.coerce.date().optional(),

    transactionReference: z.string().optional().default(""),

    notes: z.string().optional().default(""),
  }),
});
