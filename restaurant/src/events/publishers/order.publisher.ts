import { getChannel } from "../../config/rabbitmq.config.js";

export const publishEvent = async (
  type: string,
  data: unknown
) => {
  try {
    const channel = getChannel();

    channel.sendToQueue(
      process.env.ORDER_READY_QUEUE!,
      Buffer.from(
        JSON.stringify({
          type,
          data,
        })
      ),
      {
        persistent: true,
      }
    );

    console.log(
      `📤 Event Published -> ${type}`
    );
  } catch (error) {
    console.log(
      "❌ Publish Event Error",
      error
    );
  }
};