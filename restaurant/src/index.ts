import cors from "cors";
import express from "express";
import indexRouter from "./routes/index.js";
import connectDB from "./config/database.config.js";
import { env } from "./config/dotenv.config.js";
import logger from "./config/winston.config.js";
import { connectRabbitMQ } from "./config/rabbitmq.config.js";
import { startPaymentConsumer } from "./events/consumers/payment.consumer.js";

const PORT = env.PORT || 5001;
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const bootApp = async () => {
  await connectRabbitMQ();
  await startPaymentConsumer();

  app.use("/auth/v1", indexRouter);

  app.listen(PORT, () => {
    connectDB();
    logger.info(`Restaurant service is running on port ${PORT}`);
  });
};

bootApp();
