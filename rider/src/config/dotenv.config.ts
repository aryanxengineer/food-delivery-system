import dotenv from "dotenv";
import { z } from "zod";
import logger from "./winston.config.js";

// Load .env variables
dotenv.config();

/**
 * Environment Variables Schema Validation
 * Product-based company standard approach
 */
const envSchema = z.object({
  PORT: z
    .string()
    .min(1, "PORT is required")
    .transform((value) => Number(value))
    .refine((value) => !isNaN(value), {
      message: "PORT must be a valid number",
    }),

  MONGO_URI: z.string().min(1, "MONGO_URI is required").startsWith("mongodb", {
    message: "Invalid MongoDB connection string",
  }),

  JWT_SEC: z.string().min(10, "JWT_SEC must be at least 10 characters long"),
  UTILS_SERVICE: z.string().url("UTILS_SERVICE must be a valid URL"),
  RESTAURANT_SERVICE: z.string().url("RESTAURANT_SERVICE must be a valid URL"),
  REALTIME_SERVICE: z.string().url("REALTIME_SERVICE must be a valid URL"),
  INTERNAL_SERVICE_KEY: z.string().min(16, "INTERNAL_SERVICE_KEY is too weak"),
  RABBITMQ_URL: z.string().startsWith("amqp://", {
    message: "Invalid RabbitMQ URL",
  }),

  RIDER_QUEUE: z.string().min(1, "RIDER_QUEUE is required"),
  ORDER_READY_QUEUE: z.string().min(1, "ORDER_READY_QUEUE is required"),
});

/**
 * Safe Parsing
 */
const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  logger.error(
    "❌ Invalid environment variables:",
    parsedEnv.error.flatten().fieldErrors,
  );

  process.exit(1);
}

export const env = parsedEnv.data;
