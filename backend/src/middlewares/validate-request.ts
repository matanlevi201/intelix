import { Request, Response, NextFunction } from "express";
import { RequestValidationError } from "../errors";
import { z, ZodError } from "zod";

export function validateRequest(schema: z.ZodObject<any, any>) {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        throw new RequestValidationError(error.errors);
      }
      throw new Error();
    }
  };
}
