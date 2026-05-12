import { Response } from "express";
import { AuthenticatedRequest } from "../middlewares/authentication.middleware.js";
import { AdminService } from "../services/admin.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendResponse } from "../utils/sendResponse.js";
import { BadRequestError } from "../utils/errors.js";

export class AdminController {
  constructor(private adminService: AdminService) {}

  //  Get Pending Restaurant controller
  public getPendingRestaurant = asyncHandler(
    async (req: AuthenticatedRequest, res: Response) => {
      const result = this.adminService.getPendingRestaurant();

      return sendResponse({
        res,
        data: result,
        message: "Fetched pending restaurants",
      });
    },
  );

  //  Get Pending riders controller
  public getPendingRiders = asyncHandler(
    async (req: AuthenticatedRequest, res: Response) => {
      const result = this.adminService.getPendingRiders();

      return sendResponse({
        res,
        data: result,
        message: "Fetched pending riders",
      });
    },
  );

  // Verifiy restaurant controller
  public verifyRestaurant = asyncHandler(
    async (req: AuthenticatedRequest, res: Response) => {
      const { id } = req.params;

      if (typeof id !== "string") {
        throw new BadRequestError("Invalid restaurant id");
      }

      const result = this.adminService.verifyRestaurant(id);

      return sendResponse({
        res,
        data: result,
        message: "Restaurant verified successfully",
      });
    },
  );

  // Verify rider controller
  public verifyRider = asyncHandler(
    async (req: AuthenticatedRequest, res: Response) => {
      const { id } = req.params;

      if (typeof id !== "string") {
        throw new BadRequestError("Invalid rider id");
      }

      const result = this.adminService.verifyRider(id);

      return sendResponse({
        res,
        data: result,
        message: "Rider verified successfully",
      });
    },
  );
}
