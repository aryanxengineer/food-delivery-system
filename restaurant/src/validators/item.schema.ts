import { z } from "zod";

/**
 * Create Menu Item Schema
 */
export const createItemSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Menu item name must be at least 2 characters")
    .max(100, "Menu item name cannot exceed 100 characters"),

  description: z
    .string()
    .trim()
    .min(2, "Description is required")
    .max(500, "Description cannot exceed 500 characters"),

  price: z
    .number()
    .positive("Price must be greater than 0"),

  isAvailable: z
    .boolean()
    .optional(),
});

/**
 * Update Menu Item Schema
 */
export const updateItemSchema =
  createItemSchema.partial();

/**
 * Infer Types
 */
export type CreateItemInput =
  z.infer<typeof createItemSchema>;

export type UpdateItemInput =
  z.infer<typeof updateItemSchema>;