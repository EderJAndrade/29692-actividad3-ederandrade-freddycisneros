import { NextFunction, Request, Response } from "express";
import { AppError } from "../errors/AppError";

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  const isApp = err instanceof AppError;
  const status = isApp ? err.statusCode : 500;
  const message = isApp ? err.message : "Internal Server Error";

  res.status(status).json({
    error: message,
    ...(isApp && err.details ? { details: err.details } : {}),
  });
}
