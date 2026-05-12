import { AuthenticatedRequest } from "../middlewares/authentication.middleware.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Response } from "express";
import { BadRequestError, UnauthorizedError } from "../utils/errors.js";
import { sendResponse } from "../utils/sendResponse.js";
import { AuthService } from "../service/auth.service.js";
import { allowedRoles, Role } from "../types/auth.types.js";

export class AuthController {
  constructor(private authService: AuthService) {}

  public login = asyncHandler(
    async (req: AuthenticatedRequest, res: Response) => {
      const { code } = req.body;
      if (!code) {
        throw new BadRequestError("Auth code required");
      }

      const result = this.authService.login(code);

      return sendResponse({
        res,
        statusCode: 201,
        message: "User logged in successfully",
        data: result,
      });
    },
  );

  public addRole = asyncHandler(
    async (req: AuthenticatedRequest, res: Response) => {
      const id = req.user?._id;
      const { role } = req.body as { role: Role };

      if (!id) {
        throw new UnauthorizedError("Unauthorized user - Id is required");
      }

      if (!allowedRoles.includes(role)) {
        throw new BadRequestError(
          "Invalid role value - customer | rider | seller - only these roles are allowed! ",
        );
      }

      const result = this.authService.addRole(id, role);

      return sendResponse({
        res,
        statusCode: 201,
        message: "Role updated successfully",
        data: result,
      });
    },
  );

  public me = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const user = req.user;
    if (!user) {
      throw new UnauthorizedError("Unauthorized user.");
    }

    return sendResponse({
      res,
      statusCode: 200,
      message: "User details fetched successfully",
      data: user,
    });
  });

  public logout = asyncHandler(
    async (req: AuthenticatedRequest, res: Response) => {},
  );
}
