import mongoose from "mongoose";
import { env } from "./dotenv.config.js";
import logger from "./winston.config.js";

const connectDB = async () => {
  try {
    await mongoose.connect(env.MONGO_URI, {
      dbName: "Zomato_Clone",
    });

    logger.info("connected to mongodb");
  } catch (error) {
    logger.error(error);
  }
};

export default connectDB;
