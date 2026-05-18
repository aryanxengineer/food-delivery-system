import cors from "cors";
import express from "express";
import connectDB from "./config/database.config.js";
import { env } from "./config/dotenv.config.js";
import logger from "./config/winston.config.js";
import { connectRabbitMQ } from "./config/rabbitmq.config.js";

const PORT = env.PORT || 5001;
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const bootApp = async () => {
  await connectRabbitMQ();

  app.use("/api/v1");

  app.listen(PORT, () => {
    connectDB();
    logger.info(`Restaurant service is running on port ${PORT}`);
  });
};

bootApp();
