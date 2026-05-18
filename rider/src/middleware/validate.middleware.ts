import { AuthenticatedRequest } from "./authentication.middleware.js";
import { Response, NextFunction } from "express";
import { z } from "zod";

import logger from "../config/winston.config.js";

export const validate =
  (schema: z.ZodTypeAny) =>
  (req: AuthenticatedRequest, _res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      logger.error("Input validation error.");
      return next(result.error);
    }
    req.body = result.data;
    next();
  };
