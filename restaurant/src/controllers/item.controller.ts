import { Response } from "express";
import { ItemService } from "../services/item.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { BadRequestError, UnauthorizedError } from "../utils/errors.js";
import { sendResponse } from "../utils/sendResponse.js";
import { CreateItemInput } from "../validators/item.schema.js";
import { AuthenticatedRequest } from "../middlewares/authentication.middleware.js";

export class ItemController {
  constructor(private itemService: ItemService) {}

  addMenuItem = asyncHandler(
    async (req: AuthenticatedRequest, res: Response) => {
      const userId = req.user?._id;
      const file = req.file;
      const data: CreateItemInput = req.body;

      if (!userId) {
        throw new UnauthorizedError("Unauthorized user - Invalid user id");
      }

      if (!file) {
        throw new BadRequestError("Bad request - Image is required");
      }

      const result = await this.itemService.addMenuItem(userId, data, file);

      return sendResponse({
        res,
        statusCode: 201,
        message: "Item created successfully",
        data: result,
      });
    },
  );

  getAllItems = asyncHandler(
    async (req: AuthenticatedRequest, res: Response) => {
      const { id } = req.params;
      if (typeof id !== "string") {
        throw new BadRequestError("Bad Request - Missing restaurant id");
      }

      const result = await this.itemService.getAllItems(id);

      return sendResponse({
        res,
        statusCode: 200,
        message: "Fetched all items.",
        data: result,
      });
    },
  );

  deleteMenuItem = asyncHandler(
    async (req: AuthenticatedRequest, res: Response) => {
      const userId = req.user?._id;
      const { itemId } = req.params;

      if (typeof itemId !== "string") {
        throw new BadRequestError("Bad request - Invalid type of item id");
      }
      if (!userId) {
        throw new UnauthorizedError("Unauthorized user - Invalid user id");
      }

      await this.itemService.deleteMenuItem(itemId, userId);

      return sendResponse({
        res,
        statusCode: 200,
        message: "Item is deleted of your restaurant.",
      });
    },
  );

  toggleMenuItemAvailability = asyncHandler(
    async (req: AuthenticatedRequest, res: Response) => {
      const userId = req.user?._id;
      const { itemId } = req.params;

      if (typeof itemId !== "string") {
        throw new BadRequestError("Bad request - Invalid type of item id");
      }
      if (!userId) {
        throw new UnauthorizedError("Unauthorized user - Invalid user id");
      }

      const result = await this.itemService.toggleMenuItemAvailability(
        itemId,
        userId,
      );

      return sendResponse({
        res,
        statusCode: 200,
        message: result.message,
        data: result.item,
      });
    },
  );
}
