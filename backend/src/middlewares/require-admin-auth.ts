import { NextFunction, Request, Response } from "express";
import { NotAuthorizedError } from "../errors";
import { container } from "../../inversify.config";
import { IUserRepository, TYPES } from "../types";
import { UserRole } from "../database/schema";

export const requireAdminAuth = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.currentUser) {
    throw new NotAuthorizedError();
  }
  const { id } = req.currentUser;
  const userRepository = container.get<IUserRepository>(TYPES.IUserRepository);
  const user = await userRepository.findOne({ id });
  if (user.role !== UserRole.ADMIN) {
    throw new NotAuthorizedError();
  }
  next();
};
