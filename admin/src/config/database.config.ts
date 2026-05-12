import { MongoClient, Db } from "mongodb";
import { env } from "./dotenv.config.js";
import logger from "./winston.config.js";

let client: MongoClient | null = null;
let db: Db | null = null;

export const connectDb = async (): Promise<Db> => {
  if (db) return db;

  try {
    client = new MongoClient(env.MONGO_URI);
    await client.connect();

    db = client.db(env.DATABASE_NAME);

    logger.info("✅ Admin service connected to MongoDB");

    return db;
  } catch (error) {
    logger.error("❌ MongoDB connection failed:", error);
    process.exit(1); // fail fast
  }
};