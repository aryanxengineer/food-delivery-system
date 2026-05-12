import { z } from "zod";

/**
 * Nearby Restaurant Query Schema
 */
export const nearbyRestaurantSchema = z.object({
  latitude: z.coerce
    .number()
    .min(-90, "Invalid latitude")
    .max(90, "Invalid latitude"),

  longitude: z.coerce
    .number()
    .min(-180, "Invalid longitude")
    .max(180, "Invalid longitude"),

  radius: z.coerce
    .number()
    .positive("Radius must be positive")
    .default(5000),

  search: z
    .string()
    .trim()
    .default(""),
});

/**
 * Infer Type
 */
export type NearbyRestaurantQueryInput =
  z.infer<typeof nearbyRestaurantSchema>;