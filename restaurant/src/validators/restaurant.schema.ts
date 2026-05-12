import { z } from "zod";

/**
 * Restaurant Create Validation Schema
 */
export const createRestaurantSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Restaurant name must be at least 2 characters")
    .max(100, "Restaurant name cannot exceed 100 characters"),

  description: z
    .string()
    .trim()
    .max(500, "Description cannot exceed 500 characters")
    .optional(),

  phone: z.number().int().positive(),

  latitude: z
    .number()
    .min(-90, "Latitude must be greater than -90")
    .max(90, "Latitude must be less than 90"),

  longitude: z
    .number()
    .min(-180, "Longitude must be greater than -180")
    .max(180, "Longitude must be less than 180"),

  formattedAddress: z.string().trim().min(1, "Formatted address is required"),

  isOpen: z.boolean().optional(),
});

/**
 * Update Restaurant Schema
 */
export const updateRestaurantSchema = createRestaurantSchema.partial();

/**
 * Infer Types
 */
export type CreateRestaurantInput = z.infer<typeof createRestaurantSchema>;

export type UpdateRestaurantInput = z.infer<typeof updateRestaurantSchema>;
