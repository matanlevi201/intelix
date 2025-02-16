import { NextFunction, Request, Response } from "express";
import { ForbiddenError } from "../errors";
import { container } from "../../inversify.config";
import { IBlacklistRepository, TYPES } from "../types";

export const blacklistGuard = async (req: Request, res: Response, next: NextFunction) => {
  const refreshToken = req.cookies?.refreshToken;
  const blacklistRepository = container.get<IBlacklistRepository>(TYPES.IBlacklistRepository);
  const isBlackListed = await blacklistRepository.findOne({ token: refreshToken });
  if (isBlackListed) {
    throw new ForbiddenError();
  }
  next();
};
