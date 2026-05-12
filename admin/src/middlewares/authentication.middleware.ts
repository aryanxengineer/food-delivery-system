import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import logger from "../config/winston.config.js";
import { env } from "../config/dotenv.config.js";
import { ForbiddenError, UnauthorizedError } from "../utils/errors.js";

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

    const decoded = jwt.verify(token, env.JWT_SECRET) as JwtPayload;

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

export const isAdmin = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  if (!req.user) {
    throw new UnauthorizedError("Unauthorized - admin details missing!");
  }

  if (req.user.role !== "admin") {
    throw new ForbiddenError("Access denied");
  }

  next();
};
