import { z } from "zod";

export const mongoIdSchema = z
  .string()
  .regex(/^[a-f\d]{24}$/i, "Invalid MongoDB ObjectId");

export const inputAssignRiderToOrder = z.object({
  orderId: mongoIdSchema,
  riderId: mongoIdSchema,
  riderName: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(30, "Name cannot exceed 100 characters"),
  riderPhone: z.coerce.number().int().positive(),
});

export type AssignRiderToOrderInputType = z.infer<
  typeof inputAssignRiderToOrder
>;
