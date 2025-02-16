import { NextFunction, Request, Response } from "express";
import { ForbiddenError } from "../errors";

export const socialGuard = (req: Request, res: Response, next: NextFunction) => {
  const { isOauth2User } = req.currentUser;
  if (isOauth2User) {
    throw new ForbiddenError();
  }
  next();
};
