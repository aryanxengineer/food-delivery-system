import { z } from "zod";

/**
 * Reusable Mongo ObjectId Schema
 */
export const mongoIdSchema = z
  .string()
  .regex(/^[a-f\d]{24}$/i, "Invalid MongoDB ObjectId");

export const idsSchema = z.object({
  restaurantId: mongoIdSchema,
  menuItemId: mongoIdSchema,
});

export type IdsInput = z.infer<typeof idsSchema>;
