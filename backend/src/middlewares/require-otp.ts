import { NextFunction, Request, Response } from "express";
import { NotAuthorizedError } from "../errors/index";

export const requireOtp = (req: Request, res: Response, next: NextFunction) => {
  const { is2FAEnabled, is2FAVerified } = req.currentUser;
  if (is2FAEnabled && !is2FAVerified) {
    throw new NotAuthorizedError();
  }
  next();
};
