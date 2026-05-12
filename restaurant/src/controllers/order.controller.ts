import { Response } from "express";
import { AuthenticatedRequest } from "../middlewares/authentication.middleware.js";
import { OrderService } from "../services/order.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { BadRequestError, UnauthorizedError } from "../utils/errors.js";
import { sendResponse } from "../utils/sendResponse.js";
import { InputCreateOrderType } from "../validators/order.schema.js";

export class OrderController {
  constructor(private orderService: OrderService) {}

  /**
   * Create New Order
   */
  createOrder = asyncHandler(
    async (req: AuthenticatedRequest, res: Response) => {
      const userId = req.user?._id;
      const data: InputCreateOrderType = req.body;

      if (!userId) {
        throw new UnauthorizedError("Unauthorized user.");
      }

      const result = await this.orderService.createOrder(userId, data);

      return sendResponse({
        res,
        statusCode: 201,
        message: "Order created successfully",
        data: result,
      });
    },
  );

  /**
   * Fetch My Orders
   */
  getMyOrders = asyncHandler(
    async (req: AuthenticatedRequest, res: Response) => {
      const userId = req.user?._id;

      if (!userId) {
        throw new UnauthorizedError("Unauthorized user.");
      }

      const result = await this.orderService.getMyOrders(userId);

      return sendResponse({
        res,
        statusCode: 200,
        message: "Orders fetched successfully",
        data: result,
      });
    },
  );

  /**
   * Fetch Single Order
   */
  fetchSingleOrder = asyncHandler(
    async (req: AuthenticatedRequest, res: Response) => {
      const { id } = req.params;

      if (typeof id !== "string") {
        throw new BadRequestError("Invalid order id.");
      }

      const result = await this.orderService.fetchSingleOrder(id);

      return sendResponse({
        res,
        statusCode: 200,
        message: "Order fetched successfully",
        data: result,
      });
    },
  );

  /**
   * Fetch Restaurant Orders
   */
  fetchRestaurantOrders = asyncHandler(
    async (req: AuthenticatedRequest, res: Response) => {
      const { restaurantId } = req.params;

      if (typeof restaurantId !== "string") {
        throw new BadRequestError("Invalid restaurant id.");
      }

      const result =
        await this.orderService.fetchRestaurantOrders(restaurantId);

      return sendResponse({
        res,
        statusCode: 200,
        message: "Restaurant orders fetched successfully",
        data: result,
      });
    },
  );

  /**
   * Update Order Status
   */
  updateOrderStatus = asyncHandler(
    async (req: AuthenticatedRequest, res: Response) => {
      const { orderId } = req.params;
      const { status } = req.body;

      if (typeof orderId !== "string") {
        throw new BadRequestError("Invalid order id.");
      }

      if (!status) {
        throw new BadRequestError("Order status required.");
      }

      const result = await this.orderService.updateOrderStatus(orderId, status);

      return sendResponse({
        res,
        statusCode: 200,
        message: "Order status updated successfully",
        data: result,
      });
    },
  );

  /**
   * Assign Rider To Order
   */
  assignRiderToOrder = asyncHandler(
    async (req: AuthenticatedRequest, res: Response) => {
      const { orderId, riderId, riderName, riderPhone } = req.body;

      if (!orderId || !riderId || !riderName || !riderPhone) {
        throw new BadRequestError("All rider details are required.");
      }

      const result = await this.orderService.assignRiderToOrder({
        orderId,
        riderId,
        riderName,
        riderPhone,
      });

      return sendResponse({
        res,
        statusCode: 200,
        message: "Rider assigned successfully",
        data: result,
      });
    },
  );

  /**
   * Get Current Order For Rider
   */
  getCurrentOrderForRider = asyncHandler(
    async (req: AuthenticatedRequest, res: Response) => {
      const riderId = req.user?._id;

      if (!riderId) {
        throw new UnauthorizedError("Unauthorized rider.");
      }

      const result = await this.orderService.getCurrentOrderForRider(riderId);

      return sendResponse({
        res,
        statusCode: 200,
        message: "Current rider order fetched successfully",
        data: result,
      });
    },
  );

  /**
   * Update Rider Order Status
   */
  updateOrderStatusRider = asyncHandler(
    async (req: AuthenticatedRequest, res: Response) => {
      const riderId = req.user?._id;
      const { orderId, status } = req.body;

      if (!riderId) {
        throw new UnauthorizedError("Unauthorized rider.");
      }

      if (!orderId || !status) {
        throw new BadRequestError("Order id and status required.");
      }

      const result = await this.orderService.updateOrderStatusRider(
        riderId,
        orderId,
        status,
      );

      return sendResponse({
        res,
        statusCode: 200,
        message: "Rider order status updated successfully",
        data: result,
      });
    },
  );

  /**
   * Fetch Order For Payment
   */
  fetchOrderForPayment = asyncHandler(
    async (req: AuthenticatedRequest, res: Response) => {
      const { id } = req.params;

      if (typeof id !== "string") {
        throw new BadRequestError("Invalid order id.");
      }

      const result = await this.orderService.fetchOrderForPayment(id);

      return sendResponse({
        res,
        statusCode: 200,
        message: "Order payment details fetched successfully",
        data: result,
      });
    },
  );
}
