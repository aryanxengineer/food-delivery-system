import { Response } from "express";
import { AuthenticatedRequest } from "../middlewares/authentication.middleware.js";
import { OrderService } from "../services/order.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
  BadRequestError,
  ForbiddenError,
  UnauthorizedError,
} from "../utils/errors.js";
import { sendResponse } from "../utils/sendResponse.js";
import { InputCreateOrderType } from "../validators/order.schema.js";
import { env } from "../config/dotenv.config.js";
import { AssignRiderToOrderInputType } from "../validators/rider.schema.js";

const ALLOWED_STATUSES = ["accepted", "preparing", "ready_for_rider"] as const;

export class OrderController {
  constructor(private orderService: OrderService) {}

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
        data: {
          orders: result.orders,
          ordersCount: result.ordersCount,
        },
      });
    },
  );

  updateOrderStatus = asyncHandler(
    async (req: AuthenticatedRequest, res: Response) => {
      const userId = req.user?._id;

      const { orderId } = req.params;
      const { status } = req.body;

      if (typeof orderId !== "string") {
        throw new BadRequestError("Invalid order id.");
      }

      if (!userId) {
        throw new UnauthorizedError("Invalid user id.");
      }

      if (!!ALLOWED_STATUSES.includes(status)) {
        throw new BadRequestError("Order status required.");
      }

      const result = await this.orderService.updateOrderStatus(
        userId,
        orderId,
        status,
      );

      return sendResponse({
        res,
        statusCode: 200,
        message: "Order status updated successfully",
        data: result,
      });
    },
  );

  assignRiderToOrder = asyncHandler(
    async (req: AuthenticatedRequest, res: Response) => {
      if (req.headers["x-internal-key"] !== env.INTERNAL_SERVICE_KEY) {
        throw new ForbiddenError("Forbidden request");
      }

      const data: AssignRiderToOrderInputType = req.body;

      const result = await this.orderService.assignRiderToOrder(data);

      return sendResponse({
        res,
        statusCode: 200,
        message: "Rider assigned successfully",
        data: result,
      });
    },
  );

  getCurrentOrderForRider = asyncHandler(
    async (req: AuthenticatedRequest, res: Response) => {
      if (req.headers["x-internal-key"] !== env.INTERNAL_SERVICE_KEY) {
        throw new ForbiddenError("Forbidden request");
      }

      const { riderId } = req.query;

      if (typeof riderId !== "string") {
        throw new BadRequestError("Required rider id");
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

  updateOrderStatusRider = asyncHandler(
    async (req: AuthenticatedRequest, res: Response) => {
      if (req.headers["x-internal-key"] !== env.INTERNAL_SERVICE_KEY) {
        throw new ForbiddenError("Forbidden request");
      }

      const { orderId } = req.body;

      if (!orderId) {
        throw new BadRequestError("Order id is required.");
      }

      await this.orderService.updateOrderStatusRider(orderId);

      return sendResponse({
        res,
        statusCode: 201,
        message: "Rider order status updated successfully",
      });
    },
  );

  fetchOrderForPayment = asyncHandler(
    async (req: AuthenticatedRequest, res: Response) => {
      if (req.headers["x-internal-key"] !== process.env.INTERNAL_SERVICE_KEY) {
        throw new ForbiddenError("Forbidden");
      }

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
