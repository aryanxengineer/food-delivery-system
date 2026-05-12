// controllers/address.controller.ts

import { Response } from "express";
import { AuthenticatedRequest } from "../middlewares/authentication.middleware.js";
import { AddressService } from "../services/address.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
  BadRequestError,
  UnauthorizedError,
} from "../utils/errors.js";
import { sendResponse } from "../utils/sendResponse.js";

export class AddressController {
  constructor(
    private addressService: AddressService,
  ) {}

  /**
   * Add New Address
   */
  addAddress = asyncHandler(
    async (
      req: AuthenticatedRequest,
      res: Response,
    ) => {
      const userId = req.user?._id;

      if (!userId) {
        throw new UnauthorizedError(
          "Unauthorized user.",
        );
      }

      const result =
        await this.addressService.addAddress(
          userId,
          req.body,
        );

      return sendResponse({
        res,
        statusCode: 201,
        message:
          "Address added successfully",
        data: result,
      });
    },
  );

  /**
   * Delete Address
   */
  deleteAddress = asyncHandler(
    async (
      req: AuthenticatedRequest,
      res: Response,
    ) => {
      const userId = req.user?._id;
      const { id } = req.params;

      if (!userId) {
        throw new UnauthorizedError(
          "Unauthorized user.",
        );
      }

      if (typeof id !== "string") {
        throw new BadRequestError(
          "Invalid address id.",
        );
      }

      await this.addressService.deleteAddress(
        userId,
        id,
      );

      return sendResponse({
        res,
        statusCode: 200,
        message:
          "Address deleted successfully",
      });
    },
  );

  /**
   * Fetch My Addresses
   */
  getMyAddresses = asyncHandler(
    async (
      req: AuthenticatedRequest,
      res: Response,
    ) => {
      const userId = req.user?._id;

      if (!userId) {
        throw new UnauthorizedError(
          "Unauthorized user.",
        );
      }

      const result =
        await this.addressService.getMyAddresses(
          userId,
        );

      return sendResponse({
        res,
        statusCode: 200,
        message:
          "Addresses fetched successfully",
        data: result,
      });
    },
  );
}