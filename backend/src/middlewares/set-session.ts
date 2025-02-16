import { NextFunction, Request, Response } from "express";
import { AccessTokenResponse } from "@intelix/common";
import { Tokens } from "../utils";
import { env } from "../config";

export const setSession = (req: Request, res: Response<AccessTokenResponse>, next: NextFunction) => {
  const { refreshToken } = Tokens.generateRefreshToken(req.currentUser);
  const { accessToken } = Tokens.generateAccessToken(req.currentUser);
  res.cookie("refreshToken", refreshToken, { httpOnly: true, secure: env.NODE_ENV !== "test" });
  return res.status(200).send({ accessToken });
};
