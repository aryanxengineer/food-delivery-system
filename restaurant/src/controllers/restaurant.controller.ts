import { AuthenticatedRequest } from "../middlewares/authentication.middleware.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Request, Response } from "express";
import { BadRequestError, UnauthorizedError } from "../utils/errors.js";
import { CreateRestaurantInput } from "../validators/restaurant.schema.js";
import { sendResponse } from "../utils/sendResponse.js";
import { RestaurantService } from "../services/restaurant.service.js";
import { TokenService } from "../services/token.service.js";
import { nearbyRestaurantSchema } from "../validators/nearByRestaurant.schema.js";

export class RestaurantController {
  constructor(
    private tokenService: TokenService,
    private restaurantService: RestaurantService,
  ) {}

  // Add restaurant controller
  public addRestraunt = asyncHandler(
    async (req: AuthenticatedRequest, res: Response) => {
      const userId = req.user?._id;
      const restauarantInputData: CreateRestaurantInput = req.body;
      const file = req.file;

      if (!userId) {
        throw new UnauthorizedError("Unauthorized user.");
      }

      if (!file) {
        throw new BadRequestError("Image file required");
      }

      const result = await this.restaurantService.addRestaurant(
        userId,
        restauarantInputData,
        file,
      );

      return sendResponse({
        res,
        statusCode: 200,
        message: "Restaurant created successfully",
        data: result,
      });
    },
  );

  // Add restaurant controller
  public fetchMyRestaurant = asyncHandler(
    async (req: AuthenticatedRequest, res: Response) => {
      const userId = req.user?._id;
      if (!userId) {
        throw new UnauthorizedError("Unauthorized user.");
      }

      const result = await this.restaurantService.fetchMyRestaurant(userId);

      if (!req.user?.restaurantId) {
        let accessToken = this.tokenService.getAccessToken({
          ...req.user,
          restaurantId: result._id,
        });

        return sendResponse({
          res,
          statusCode: 200,
          message: "Restaurant fetched successfully",
          data: {
            restaurant: result,
            token: accessToken,
          },
        });
      }

      return sendResponse({
        res,
        statusCode: 200,
        message: "Restaurant fetched successfully",
        data: result,
      });
    },
  );

  // Add restaurant controller
  public updateStatusRestaurant = asyncHandler(
    async (req: AuthenticatedRequest, res: Response) => {
      const userId = req.user?._id;
      const { status } = req.body;

      if (!userId) {
        throw new UnauthorizedError("Unauthorized user.");
      }

      if (typeof status !== "boolean") {
        throw new BadRequestError("Invalid input - bad request");
      }

      const result = await this.restaurantService.updateStatusRestaurant(
        userId,
        { isOpen: status },
      );

      return sendResponse({
        res,
        statusCode: 201,
        message: "Restaurant status updated",
        data: result,
      });
    },
  );

  // Add restaurant controller
  public updateRestaurant = asyncHandler(
    async (req: AuthenticatedRequest, res: Response) => {
      const userId = req.user?._id;
      const { name, description } = req.body;

      if (!userId) {
        throw new UnauthorizedError("Unauthorized user.");
      }

      if (!name || !description) {
        throw new BadRequestError("Invalid input - bad request");
      }

      const result = await this.restaurantService.updateStatusRestaurant(
        userId,
        {
          name,
          description,
        },
      );

      return sendResponse({
        res,
        statusCode: 201,
        message: "Restaurant status updated",
        data: result,
      });
    },
  );

  // Add restaurant controller
  public getNearbyRestaurant = asyncHandler(
    async (req: Request, res: Response) => {
      const validatedQuery = nearbyRestaurantSchema.parse(req.query);

      const {
        latitude,
        longitude,
        radius = 5000,
        search = "",
      } = validatedQuery;

      if (!latitude || !longitude) {
        throw new BadRequestError("Invalid coordinate points");
      }

      const result =
        await this.restaurantService.getNearbyRestaurant(validatedQuery);

      return sendResponse({
        res,
        statusCode: 200,
        message: "Your nearest restaurants",
        data: result,
      });
    },
  );

  // Add restaurant controller
  public fetchSingleRestaurant = asyncHandler(
    async (req: AuthenticatedRequest, res: Response) => {
      const { id } = req.params;
      if (typeof id !== "string") {
        throw new BadRequestError("Invalid restaurant Id");
      }

      const result = await this.restaurantService.fetchSingleRestaurant(id);

      return sendResponse({
        res,
        statusCode: 200,
        message: "Fetched single restaurant",
        data: result,
      });
    },
  );
}
