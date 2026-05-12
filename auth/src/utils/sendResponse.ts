import { Response } from "express";

interface SendResponseOptions<T> {
  res: Response;
  statusCode?: number;
  message?: string;
  data?: T;
  meta?: Record<string, any>;
}

export const sendResponse = <T>({
  res,
  statusCode = 200,
  message = "Success",
  data,
  meta,
}: SendResponseOptions<T>) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
    meta,
  });
};