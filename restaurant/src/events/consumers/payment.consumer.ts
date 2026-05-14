import { getChannel } from "../../config/rabbitmq.config.js";
import { OrderModel } from "../../models/order.model.js";
import { emitRealtimeEvent } from "../../utils/realtime.js";

export const startPaymentConsumer = async () => {
  const channel = getChannel();

  channel.consume(process.env.PAYMENT_QUEUE!, async (msg) => {
    if (!msg) return;

    try {
      const event = JSON.parse(msg.content.toString());

      if (event.type !== "PAYMENT_SUCCESS") {
        channel.ack(msg);
        return;
      }

      const { orderId } = event.data;

      const order = await OrderModel.findOneAndUpdate(
        {
          _id: orderId,
          paymentStatus: {
            $ne: "paid",
          },
        },
        {
          $set: {
            paymentStatus: "paid",
            status: "placed",
          },

          $unset: {
            expiresAt: 1,
          },
        },
        {
          new: true,
        },
      );

      if (!order) {
        channel.ack(msg);
        return;
      }

      console.log("✅ Order Placed:", order._id);

      // realtime emit

      await emitRealtimeEvent({
        event: "order:new",

        room: `restaurant:${order.restaurantId}`,

        payload: {
          orderId: order._id,
        },
      });

      channel.ack(msg);
    } catch (error) {
      console.log("❌ Payment Consumer Error:", error);

      // message requeue mat karo
      channel.nack(msg, false, false);
    }
  });
};
