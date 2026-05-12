import { Request, Response, NextFunction } from "express";
import { UnauthorizedError } from "../utils/errors.js";

import logger from "../config/winston.config.js";
import { TokenService } from "../service/token.service.js";

export interface IUser {
  _id: string;
  name: string;
  email: string;
  image: string;
  role: string;
  restaurantId: string;
}

export interface AuthenticatedRequest extends Request {
  user?: IUser;
}

export const isAuth = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      throw new UnauthorizedError("Invalid token format!");
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      throw new UnauthorizedError("Unauthorized - Invalid token");
    }

    const tokenService = new TokenService();
    const decoded = tokenService.verifyAccessToken(token);

    if (!decoded || !decoded.user) {
      throw new UnauthorizedError("Invalid token");
    }

    req.user = decoded.user as IUser;

    next();
  } catch (error) {
    logger.warn("JWT verification failed", error);

    throw new UnauthorizedError("Invalid token - Verification failed");
  }
};
