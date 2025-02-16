import { NextFunction, Request, Response } from "express";
import { BadRequestError, ForbiddenError, NotFoundError } from "../errors";
import { TFAToken, Generate2faQrResponse } from "@intelix/common";
import { container } from "../../inversify.config";
import { IUserRepository, TYPES } from "../types";
import speakeasy from "speakeasy";
import { UserRole } from "../database/schema";

export const verify2fa = async function (req: Request<{}, {}, TFAToken>, res: Response, next: NextFunction) {
  const { id } = req.currentUser;
  const { token } = req.body;
  const userRepository = container.get<IUserRepository>(TYPES.IUserRepository);
  const user = await userRepository.findOne({ id });
  if (!user) {
    throw new NotFoundError();
  }
  if (!user.is2FAEnabled) {
    throw new BadRequestError("Two factor is not enabled");
  }
  const verified = speakeasy.totp.verify({ secret: user.twoFactorSecret, encoding: "base32", token });
  if (!verified) {
    throw new ForbiddenError();
  }
  req.currentUser = { id: user.id, email: user.email, is2FAEnabled: user.is2FAEnabled, is2FAVerified: true, isOauth2User: false, isAdmin: user.role === UserRole.ADMIN };
  next();
};

export const generate2faQr = async function (req: Request, res: Response<Generate2faQrResponse>) {
  const { id } = req.currentUser;
  const userRepository = container.get<IUserRepository>(TYPES.IUserRepository);
  const tempSecret = speakeasy.generateSecret();
  const user = await userRepository.update(id, { twoFactorSecret: tempSecret.base32 });
  if (!user) {
    throw new BadRequestError("Failed to generate QR");
  }
  res.status(200).send({ secret: tempSecret.base32, qr: tempSecret.otpauth_url });
};

export const enable2fa = async function (req: Request<{}, {}, TFAToken>, res: Response, next: NextFunction) {
  const { id } = req.currentUser;
  const { token } = req.body;
  const userRepository = container.get<IUserRepository>(TYPES.IUserRepository);
  const user = await userRepository.findOne({ id });
  if (!user) {
    throw new NotFoundError();
  }
  const verified = speakeasy.totp.verify({ secret: user.twoFactorSecret, encoding: "base32", token });
  if (!verified) {
    await userRepository.update(id, { twoFactorSecret: null });
    throw new ForbiddenError();
  }
  await userRepository.update(id, { is2FAEnabled: true });
  req.currentUser = { id: user.id, email: user.email, is2FAEnabled: true, is2FAVerified: true, isOauth2User: false, isAdmin: user.role === UserRole.ADMIN };
  next();
};

export const disable2fa = async function (req: Request<{}, {}, TFAToken>, res: Response, next: NextFunction) {
  const { id } = req.currentUser;
  const { token } = req.body;
  const userRepository = container.get<IUserRepository>(TYPES.IUserRepository);
  const user = await userRepository.findOne({ id });
  const verified = speakeasy.totp.verify({ secret: user.twoFactorSecret, encoding: "base32", token });
  if (!verified) {
    throw new ForbiddenError();
  }
  const updatedUser = await userRepository.update(id, { is2FAEnabled: false, twoFactorSecret: null });
  if (!updatedUser) {
    throw new BadRequestError("Failed to disable 2fa");
  }
  req.currentUser = { id: user.id, email: user.email, is2FAEnabled: false, is2FAVerified: false, isOauth2User: false, isAdmin: user.role === UserRole.ADMIN };
  next();
};

// @injectable()
// export class TwoFactorController implements ITwoFactorController {
//   constructor(@inject(TYPES.IUserRepository) private userRepository: IUserRepository) {
//     logger.info(`[Container] ${TwoFactorController.name} added successfully`);
//   }

//   generate2faQr = async (req: Request, res: Response) => {
//     const { id } = req.currentUser;
//     const tempSecret = speakeasy.generateSecret();
//     const user = await this.userRepository.update(id, { twoFactorSecret: tempSecret.base32 });
//     if (!user) {
//       throw new BadRequestError("Failed to generate QR");
//     }
//     res.status(200).send({ secret: tempSecret.base32, qr: tempSecret.otpauth_url });
//   };

//   enable2fa = async (req: Request, res: Response, next: NextFunction) => {
//     const { id } = req.currentUser;
//     const { token } = req.body;
//     const user = await this.userRepository.findOne({ id });
//     if (!user) {
//       throw new NotFoundError();
//     }
//     const verified = speakeasy.totp.verify({ secret: user.twoFactorSecret, encoding: "base32", token });
//     if (!verified) {
//       await this.userRepository.update(id, { twoFactorSecret: null });
//       throw new ForbiddenError();
//     }
//     await this.userRepository.update(id, { is2FAEnabled: true });
//     req.currentUser = { id: user.id, email: user.email, is2FAEnabled: true, is2FAVerified: true, isOauth2User: false };
//     next();
//   };

//   verify2fa = async (req: Request, res: Response, next: NextFunction) => {
//     const { id } = req.currentUser;
//     const { token } = req.body;
//     const user = await this.userRepository.findOne({ id });
//     if (!user) {
//       throw new NotFoundError();
//     }
//     if (!user.is2FAEnabled) {
//       throw new BadRequestError("Two factor is not enabled");
//     }
//     const verified = speakeasy.totp.verify({ secret: user.twoFactorSecret, encoding: "base32", token });
//     if (!verified) {
//       throw new ForbiddenError();
//     }
//     req.currentUser = { id: user.id, email: user.email, is2FAEnabled: user.is2FAEnabled, is2FAVerified: true, isOauth2User: false };
//     next();
//   };

//   disable2fa = async (req: Request, res: Response, next: NextFunction) => {
//     const { id } = req.currentUser;
//     const { token } = req.body;
//     const user = await this.userRepository.findOne({ id });
//     const verified = speakeasy.totp.verify({ secret: user.twoFactorSecret, encoding: "base32", token });
//     if (!verified) {
//       throw new ForbiddenError();
//     }
//     const updatedUser = await this.userRepository.update(id, { is2FAEnabled: false, twoFactorSecret: null });
//     if (!updatedUser) {
//       throw new BadRequestError("Failed to disable 2fa");
//     }
//     req.currentUser = { id: user.id, email: user.email, is2FAEnabled: false, is2FAVerified: false, isOauth2User: false };
//     next();
//   };
// }
