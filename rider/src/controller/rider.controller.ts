import { AuthenticatedRequest } from "../middleware/authentication.middleware.js";
import { BadRequestError, UnauthorizedError } from "../utils/errors.js";
import { RiderService } from "../service/rider.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendResponse } from "../utils/sendResponse.js";
import { Response } from "express";
import {
  CreateRiderProfileType,
  UpdateRiderProfileType,
} from "../validator/rider.schema.js";

export class RiderController {
  constructor(private riderService: RiderService) {}

  addRiderProfile = asyncHandler(
    async (req: AuthenticatedRequest, res: Response) => {
      const riderId = req.user?._id;
      const profileData: CreateRiderProfileType = req.body;
      const file = req.file;

      if (!riderId) {
        throw new UnauthorizedError("Unauthorized user - login again");
      }
      if (!file) {
        throw new BadRequestError("Bad request - profile image must be needed");
      }

      const result = this.riderService.addRiderProfile(
        riderId,
        profileData,
        file,
      );

      return sendResponse({
        res,
        statusCode: 200,
        message: "Rider profile created successfully",
        data: result,
      });
    },
  );

  fetchMyProfile = asyncHandler(
    async (req: AuthenticatedRequest, res: Response) => {
      const riderId = req.user?._id;
      if (!riderId) {
        throw new UnauthorizedError("Unauthorized user - login again");
      }

      const result = await this.riderService.fetchMyProfile(riderId);

      return sendResponse({
        res,
        statusCode: 200,
        message: "Your profile fetched successfully",
        data: result,
      });
    },
  );

  toggleRiderAvailability = asyncHandler(
    async (req: AuthenticatedRequest, res: Response) => {
      const riderId = req.user?._id;
      const data: UpdateRiderProfileType = req.body;
      if (!riderId) {
        throw new UnauthorizedError("Unauthorized user - login again");
      }

      const result = await this.riderService.toggleRiderAvailability(
        riderId,
        data,
      );

      return sendResponse({
        res,
        statusCode: 200,
        message: result.message,
        data: result.availableRider,
      });
    },
  );

  acceptOrder = asyncHandler(
    async (req: AuthenticatedRequest, res: Response) => {
      const riderId = req.user?._id;
      const { orderId } = req.params;

      if (!riderId) {
        throw new UnauthorizedError("Unauthorized user - login again");
      }

      if (typeof orderId !== "string") {
        throw new BadRequestError("Bad request - Invalid order id");
      }

      const result = await this.riderService.acceptOrder(riderId, orderId);

      return sendResponse({
        res,
        statusCode: 200,
        message: "",
      });
    },
  );

  fetchMyCurrentOrder = asyncHandler(
    async (req: AuthenticatedRequest, res: Response) => {
      const riderId = req.user?._id;
      if (!riderId) {
        throw new UnauthorizedError("Unauthorized user - login again");
      }

      return sendResponse({
        res,
        statusCode: 200,
        message: "",
      });
    },
  );

  updateOrderStatus = asyncHandler(
    async (req: AuthenticatedRequest, res: Response) => {
      const riderId = req.user?._id;
      if (!riderId) {
        throw new UnauthorizedError("Unauthorized user - login again");
      }

      return sendResponse({
        res,
        statusCode: 200,
        message: "",
      });
    },
  );
}
