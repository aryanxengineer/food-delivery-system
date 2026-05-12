import { AuthenticatedRequest } from "../middlewares/authentication.middleware.js";
import { CartService } from "../services/cart.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Response } from "express";
import { BadRequestError, UnauthorizedError } from "../utils/errors.js";
import { sendResponse } from "../utils/sendResponse.js";

export class CartController {
  constructor(private cartService: CartService) {}

  addToCart = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user?._id;
    const { restaurantId, itemId } = req.body;
    if (!userId) {
      throw new UnauthorizedError("Unauthorized user - Invalid user id.");
    }

    const result = await this.cartService.addToCart(
      userId,
      restaurantId,
      itemId,
    );

    return sendResponse({
      res,
      statusCode: 201,
      message: "Cart created successfully",
      data: result,
    });
  });

  fetchMyCart = asyncHandler(
    async (req: AuthenticatedRequest, res: Response) => {
      const userId = req.user?._id;
      if (!userId) {
        throw new UnauthorizedError("Unauthorized user - Invalid user id.");
      }

      const result = await this.cartService.fetchMyCart(userId);

      return sendResponse({
        res,
        statusCode: 200,
        message: "Cart fetched successfully",
        data: result,
      });
    },
  );

  incrementCartItem = asyncHandler(
    async (req: AuthenticatedRequest, res: Response) => {
      const userId = req.user?._id;
      const { itemId } = req.body;

      if (!userId) {
        throw new UnauthorizedError("Unauthorized user - Invalid user id.");
      }
      if (!itemId) {
        throw new BadRequestError("Bad request - Invalid item id.");
      }

      const result = await this.cartService.incrementCartItem(userId, itemId);

      return sendResponse({
        res,
        statusCode: 201,
        message: "Cart incremented successfully",
        data: result,
      });
    },
  );

  decrementCartItem = asyncHandler(
    async (req: AuthenticatedRequest, res: Response) => {
      const userId = req.user?._id;
      const { itemId } = req.body;

      if (!userId) {
        throw new UnauthorizedError("Unauthorized user - Invalid user id.");
      }
      if (!itemId) {
        throw new BadRequestError("Bad request - Invalid item id.");
      }

      const result = await this.cartService.decrementCartItem(userId, itemId);

      return sendResponse({
        res,
        statusCode: 201,
        message: result.message ?? "Item decremented successfully",
        data: result.item ?? {},
      });
    },
  );

  clearCart = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user?._id;

    if (!userId) {
      throw new UnauthorizedError("Unauthorized user - Invalid user id.");
    }

    await this.cartService.clearCart(userId);

    return sendResponse({
      res,
      statusCode: 200,
      message: "Cart cleared successfully",
    });
  });
}
