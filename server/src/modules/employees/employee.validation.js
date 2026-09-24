import { z } from "zod";

export const createEmployeeSchema =
  z.object({
    employeeCode: z
      .string()
      .min(2)
      .max(30),

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

    designation: z
      .string()
      .min(2)
      .max(100),

    department: z
      .string()
      .max(100)
      .optional(),

    skills: z
      .array(
        z.string().max(100)
      )
      .optional(),

    joiningDate: z
      .string()
      .datetime()
      .optional(),

    salary: z
      .number()
      .min(0)
      .nullable()
      .optional(),

    emergencyContact: z
      .object({
        name: z
          .string()
          .max(100)
          .optional(),

        phone: z
          .string()
          .max(15)
          .optional(),

        relationship: z
          .string()
          .max(50)
          .optional(),
      })
      .optional(),

    status: z
      .enum([
        "ACTIVE",
        "INACTIVE",
        "ON_LEAVE",
      ])
      .optional(),

    notes: z
      .string()
      .max(3000)
      .optional(),

    userId: z
      .string()
      .optional(),
  });

export const updateEmployeeSchema =
  createEmployeeSchema.partial();