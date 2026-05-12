import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/errors.js";
import logger from "../config/winston.config.js";

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {

  // Unhandled rejection handledusing process runtime handling

  process.on("unhandledRejection", (error) => {
    logger.warn("Unhandled error", error);
  });

  // Known (operational) error
  if (err instanceof AppError) {
    logger.warn(err.message);

    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      error: {
        code: err.statusCode,
      },
    });
  }

  // Unknown error
  logger.error("Unexpected error", err);

  return res.status(500).json({
    success: false,
    message: "Internal Server Error",
    error: {
      code: 500,
    },
  });
};
