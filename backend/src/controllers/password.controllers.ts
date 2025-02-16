import { Request, Response } from "express";
import { IEmailRepository, IEmailService, IUserRepository, TYPES } from "../types/index";
import { BadRequestError, ForbiddenError, NotFoundError, FailedEmailError } from "../errors";
import { ResetPasswordBody, ChangePasswordBody, CurrentUser } from "@intelix/common";
import { container } from "../../inversify.config";
import { Password, Tokens } from "../utils";
import { env } from "../config";
import jwt from "jsonwebtoken";

export const resetPassword = async function (req: Request<{}, {}, ResetPasswordBody>, res: Response) {
  const { resetToken } = req.query;
  const { password } = req.body;
  if (!resetToken) {
    throw new BadRequestError("Invalid reset token");
  }
  let payload: CurrentUser;
  try {
    payload = jwt.verify(resetToken as string, env.RESET_JWT_KEY) as CurrentUser;
  } catch (error) {
    throw new ForbiddenError();
  }
  const userRepository = container.get<IUserRepository>(TYPES.IUserRepository);
  const user = await userRepository.findOne({ email: payload.email });
  if (!user) {
    throw new NotFoundError();
  }
  await userRepository.update(user.id, {
    password: await Password.toHash(password),
  });
  res.status(200).send();
};

export const forgotPassword = async function (req: Request, res: Response) {
  const emailService = container.get<IEmailService>(TYPES.IEmailService);
  const userRepository = container.get<IUserRepository>(TYPES.IUserRepository);
  const emailRepository = container.get<IEmailRepository>(TYPES.IEmailRepository);
  const user = await userRepository.findOne({
    email: req.body.email,
    googleId: null,
    facebookId: null,
  });
  if (!user) {
    throw new NotFoundError();
  }
  const { resetToken } = Tokens.generateResetToken(user.email);
  const requestId = await emailService.sendEmail(user.email, env.RESET_PASSWORD_TEMPLATE_ID, {
    button_link: `${env.CLIENT_URL}/reset-password?token=${resetToken}`,
  });
  if (!requestId) {
    throw new FailedEmailError("Email failed to send");
  }
  const mail = await emailRepository.create({
    userId: user.id,
    mailId: requestId,
  });
  res.status(201).send({ mailId: mail.id });
};

export const changePassword = async function (req: Request<{}, {}, ChangePasswordBody>, res: Response) {
  const { currentPassword, newPassword } = req.body;
  const userRepository = container.get<IUserRepository>(TYPES.IUserRepository);
  const user = await userRepository.findOne({ id: req.currentUser.id });
  if (!user) {
    throw new NotFoundError();
  }
  const isCurrentPasswordMatching = await Password.compare(user.password, currentPassword);
  if (!isCurrentPasswordMatching) {
    throw new BadRequestError("Invalid credentials");
  }
  await userRepository.update(user.id, {
    password: await Password.toHash(newPassword),
  });
  res.status(200).send();
};
