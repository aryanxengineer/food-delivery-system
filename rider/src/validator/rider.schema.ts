import { z } from "zod";

export const createRiderProfileSchema = z.object({
  phoneNumber: z.string().regex(/^[6-9]\d{9}$/, "Invalid Indian phone number"),

  aadharNumber: z.string().regex(/^\d{12}$/, "Aadhar number must be 12 digits"),

  drivingLicenseNumber: z.string().min(5, "Driving license number is required"),

  latitude: z.coerce
    .number()
    .min(-90, "Latitude must be >= -90")
    .max(90, "Latitude must be <= 90"),

  longitude: z.coerce
    .number()
    .min(-180, "Longitude must be >= -180")
    .max(180, "Longitude must be <= 180"),
});

export const updateRiderProfileSchema = createRiderProfileSchema
  .partial()
  .extend({
    latitude: z.coerce
      .number()
      .min(-90, "Latitude must be >= -90")
      .max(90, "Latitude must be <= 90"),

    longitude: z.coerce
      .number()
      .min(-180, "Longitude must be >= -180")
      .max(180, "Longitude must be <= 180"),

    isAvailable: z.boolean(),
  });

export type UpdateRiderProfileType = z.infer<typeof updateRiderProfileSchema>;

export type CreateRiderProfileType = z.infer<typeof createRiderProfileSchema>;
