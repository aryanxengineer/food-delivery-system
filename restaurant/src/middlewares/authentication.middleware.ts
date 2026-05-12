import { Request, Response, NextFunction } from "express";
import { UnauthorizedError } from "../utils/errors.js";

import logger from "../config/winston.config.js";
import jwt, { JwtPayload } from "jsonwebtoken";
import { TokenService } from "../services/token.service.js";

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
    const decodedValue = tokenService.verifyAccessToken(token);

    if (!decodedValue || !decodedValue.user) {
      throw new UnauthorizedError("Invalid token");
    }

    req.user = decodedValue.user as IUser;

    next();
  } catch (error) {
    logger.warn("JWT verification failed", error);

    throw new UnauthorizedError("Invalid token - Verification failed");
  }
};

export const isSeller = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const user = req.user;

  if (user && user.role !== "seller") {
    throw new UnauthorizedError("Unauthorized seller you are.");
  }

  next();
};
