import { z } from "zod";

export const inputCreateOrder = z.object({
  paymentMethod: z.enum(["razorpay", "stripe"]).default("razorpay"),
  addressId: z.string().trim(),
});

export type InputCreateOrderType = z.infer<typeof inputCreateOrder>;
