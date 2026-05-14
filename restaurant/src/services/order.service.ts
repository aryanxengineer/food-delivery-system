import { ICart } from "../models/cart.model.js";
import { AddressRepository } from "../repositories/address.repository.js";
import { CartRepository } from "../repositories/cart.repository.js";
import { OrderRepository } from "../repositories/order.repository.js";
import { RestaurantRepository } from "../repositories/restaurant.repository.js";
import {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
} from "../utils/errors.js";

import { InputCreateOrderType } from "../validators/order.schema.js";
import { emitRealtimeEvent } from "../utils/realtime.js";
import logger from "../config/winston.config.js";
import { publishEvent } from "../events/publishers/order.publisher.js";

export class OrderService {
  constructor(
    private restaurantRepository: RestaurantRepository,
    private cartRepository: CartRepository,
    private addressRepository: AddressRepository,
    private orderRepository: OrderRepository,
  ) {}

  createOrder = async (userId: string, orderData: InputCreateOrderType) => {
    const address = await this.addressRepository.findOne(
      userId,
      orderData.addressId,
    );

    if (!address) {
      throw new NotFoundError("Address not found - Invalid address id");
    }

    const getDistanceKm = (
      lat1: number,
      lon1: number,
      lat2: number,
      lon2: number,
    ): number => {
      const R = 6371;
      const dLat = ((lat2 - lat1) * Math.PI) / 180;
      const dLon = ((lon2 - lon1) * Math.PI) / 180;

      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((lat1 * Math.PI) / 180) *
          Math.cos((lat2 * Math.PI) / 180) *
          Math.sin(dLon / 2) *
          Math.sin(dLon / 2);

      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      return +(R * c).toFixed(2);
    };

    const cartItems = await this.cartRepository.find(userId);

    if (cartItems.length === 0) {
      throw new NotFoundError("Cart is empty - No carts found");
    }

    const firstCartItem = cartItems[0];

    if (!firstCartItem || !firstCartItem.restaurantId) {
      throw new BadRequestError("Invalid cart data");
    }

    const restaurantId = firstCartItem.restaurantId._id;

    const restaurant = await this.restaurantRepository.findById(
      restaurantId.toString(),
    );

    if (!restaurant) {
      throw new NotFoundError("Restaurant not found");
    }

    if (!restaurant.isOpen) {
      throw new NotFoundError("Sorry this restaurant is closed for now");
    }

    const distance = getDistanceKm(
      address.location.coordinates[1],
      address.location.coordinates[0],
      restaurant.autoLocation.coordinates[1],
      restaurant.autoLocation.coordinates[0],
    );

    let subtotal = 0;

    const orderItems = cartItems.map((cart: ICart) => {
      const item = cart.itemId as any;

      if (!item || typeof item !== "object") {
        throw new Error("Invalid cart item");
      }

      const itemTotal = item.price * cart.quantity;

      subtotal += itemTotal;

      return {
        itemId: item._id.toString(),
        name: item.name as string,
        price: item.price as number,
        quantity: cart.quantity,
      };
    });

    const deliveryFee = subtotal < 250 ? 49 : 0;
    const platformFee = 7;
    const totalAmount = subtotal + deliveryFee + platformFee;

    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    const [longitude, latitude] = address.location.coordinates;

    const riderAmount = Math.ceil(distance) * 17;

    const order = await this.orderRepository.create({
      userId,
      restaurantId: restaurantId.toString(),
      restaurantName: restaurant.name,
      distance,
      riderAmount,
      items: orderItems,
      subtotal,
      deliveryFee,
      platformFee,
      totalAmount,
      addressId: address._id.toString(),
      deliveryAddress: {
        formattedAddress: address.formattedAddress,
        mobile: address.mobile,
        latitude,
        longitude,
      },
      paymentMethod: orderData.paymentMethod,
      paymentStatus: "pending",
      status: "placed",
      expiresAt,
    });
  };

  getMyOrders = async (userId: string) => {
    const paidOrders = await this.orderRepository.find({
      userId,
      paymentStatus: "paid",
    });
    if (!paidOrders) {
      throw new NotFoundError("Orders not found");
    }

    return paidOrders;
  };

  fetchSingleOrder = async (orderId: string) => {
    const order = await this.orderRepository.findById(orderId);
    if (!order) {
      throw new NotFoundError("Order not found");
    }

    return order;
  };

  fetchRestaurantOrders = async (restaurantId: string) => {
    const placedOrders = await this.orderRepository.find({
      restaurantId,
      paymentStatus: "paid",
    });

    if (!placedOrders) {
      throw new NotFoundError("Placed orders not found");
    }

    return {
      orders: placedOrders,
      ordersCount: placedOrders.length,
    };
  };

  updateOrderStatus = async (
    userId: string,
    orderId: string,
    status: "accepted" | "preparing" | "ready_for_rider",
  ) => {
    const order = await this.orderRepository.findOne({
      _id: orderId,
      paymentStatus: "paid",
    });

    if (!order) {
      throw new NotFoundError("Order not found");
    }

    const restaurant = await this.restaurantRepository.findById(
      order.restaurantId,
    );

    if (!restaurant) {
      throw new NotFoundError("Restaurant not found");
    }

    if (restaurant.ownerId !== userId) {
      throw new UnauthorizedError(
        "You can not allowed to access this resource",
      );
    }

    await this.orderRepository.findOneAndUpdate({ status });

    await emitRealtimeEvent({
      event: "order:update",
      room: `user:${order.userId}`,
      payload: {
        orderId: order._id,
        status: order.status,
      },
    });

    if (status === "ready_for_rider") {
      logger.info(
        "Publishing Order ready for rider event for order",
        order._id,
      );

      await publishEvent("ORDER_READY_FOR_RIDER", {
        orderId: order._id.toString(),
        restaurantId: restaurant._id.toString(),
        location: restaurant.autoLocation,
      });

      console.log("Event Published successfully");
    }

    return order;

  };

  assignRiderToOrder = async (riderData: {
    orderId: string;
    riderId: string;
    riderName: string;
    riderPhone: number;
  }) => {};

  getCurrentOrderForRider = async (riderId: string) => {};

  updateOrderStatusRider = async (
    riderId: string,
    orderId: string,
    status: string,
  ) => {};

  fetchOrderForPayment = async (orderId: string) => {};
}
