import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { NextFunction, Request, Response } from "express";
import { AppError } from "../errors/AppError";

export function validateDto<T extends object>(DtoClass: new () => T) {
  return async (req: Request, _res: Response, next: NextFunction) => {
    const dto = plainToInstance(DtoClass, req.body);
    const errors = await validate(dto, { whitelist: true, forbidNonWhitelisted: true });
    if (errors.length) {
      throw new AppError(
        400,
        "Validation error",
        errors.map((e) => ({ property: e.property, constraints: e.constraints }))
      );
    }
    req.body = dto;
    next();
  };
}
