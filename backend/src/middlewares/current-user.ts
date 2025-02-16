import { NextFunction, Request, Response } from "express";
import { CurrentUser } from "@intelix/common";
import { env } from "../config";
import jwt from "jsonwebtoken";

export const currentUser = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(" ")[1];
  try {
    const payload = jwt.verify(token, env.ACCESS_JWT_KEY) as CurrentUser;
    req.currentUser = payload;
    return next();
  } catch {}

  next();
};
