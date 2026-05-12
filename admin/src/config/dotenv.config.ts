import { z } from "zod";
import dotenv from "dotenv";
import logger from "./winston.config.js";

dotenv.config();

const envSchema = z.object({
  PORT: z.coerce.number().default(5000),
  MONGO_URI: z.string().min(1),
  DATABASE_NAME: z.string().min(1),
  JWT_SECRET: z.string().min(1),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  logger.error("❌ Invalid environment variables:");
  logger.error(parsed.error.format());
  process.exit(1);
}

export const env = parsed.data;