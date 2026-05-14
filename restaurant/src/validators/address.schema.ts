import { z } from "zod";

export const createAddressSchema = z.object({
  mobile: z
    .number()
    .int("Mobile number must be integer")
    .refine(
      (value) =>
        /^[6-9]\d{9}$/.test(value.toString()),
      {
        message: "Invalid mobile number",
      },
    ),

  formattedAddress: z
    .string()
    .trim()
    .min(5, "Address is too short")
    .max(500, "Address is too long"),

  latitude: z.coerce
    .number()
    .min(-90, "Invalid latitude")
    .max(90, "Invalid latitude"),

  longitude: z.coerce
    .number()
    .min(-180, "Invalid longitude")
    .max(180, "Invalid longitude"),
});

/**
 * Infer Type
 */
export type CreateAddressInput =
  z.infer<typeof createAddressSchema>;