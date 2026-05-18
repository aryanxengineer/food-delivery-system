import amqp from "amqplib";
import { env } from "./dotenv.config.js";
import logger from "./winston.config.js";

let channel: amqp.Channel;

export const connectRabbitMQ = async () => {
  try {
    const connection = await amqp.connect(env.RABBITMQ_URL!);

    channel = await connection.createChannel();

    await channel.assertQueue(env.RIDER_QUEUE!, {
      durable: true,
    });

    await channel.assertQueue(env.ORDER_READY_QUEUE!, {
      durable: true,
    });

    logger.info("🐇 RabbitMQ Connected (restaurant service)");
  } catch (error) {
    logger.error("❌ RabbitMQ Connection Error", error);
    process.exit(1);
  }
};

export const getChannel = () => {
  if (!channel) {
    throw new Error("RabbitMQ channel not initialized");
  }

  return channel;
};
