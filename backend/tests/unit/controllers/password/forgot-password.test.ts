import { IEmailRepository, IEmailService, IUserRepository, TYPES } from "../../../../src/types";
import { mockEmailRepository, mockUserRepository } from "../../__mocks__/repositories";
import { forgotPassword } from "../../../../src/controllers/password.controllers";
import { FailedEmailError, NotFoundError } from "../../../../src/errors";
import { mockRequest, mockResponse } from "../../__mocks__/express";
import { mockEmailService } from "../../__mocks__/external";
import { container } from "../../../../inversify.config";
import { Tokens } from "../../../../src/utils";

jest.mock("../../../../src/utils");

describe("PASSWORD / forgotPassword Controller", () => {
  container.bind<IUserRepository>(TYPES.IUserRepository).toConstantValue(mockUserRepository);
  container.bind<IEmailRepository>(TYPES.IEmailRepository).toConstantValue(mockEmailRepository);
  container.bind<IEmailService>(TYPES.IEmailService).toConstantValue(mockEmailService);

  it("should throw not found error when user not found", async () => {
    const body = { email: "test@example.com" };
    const mockReq = mockRequest({ body });
    const mockRes = mockResponse();

    mockUserRepository.findOne.mockResolvedValue(null);

    await expect(forgotPassword(mockReq, mockRes)).rejects.toThrow(NotFoundError);

    expect(mockUserRepository.findOne).toHaveBeenCalledWith({ email: "test@example.com", googleId: null, facebookId: null });
  });

  it("should throw email not sent error when email failed to sent", async () => {
    const body = { email: "test@example.com" };
    const mockReq = mockRequest({ body });
    const mockRes = mockResponse();

    mockUserRepository.findOne.mockResolvedValue(body);
    mockEmailService.sendEmail.mockResolvedValue(null);
    jest.spyOn(Tokens, "generateResetToken").mockReturnValue({ resetToken: "resetToken" });

    await expect(forgotPassword(mockReq, mockRes)).rejects.toThrow(FailedEmailError);

    const button_link = `${process.env.CLIENT_URL}/reset-password?token=resetToken`;
    expect(mockUserRepository.findOne).toHaveBeenCalledWith({ email: "test@example.com", googleId: null, facebookId: null });
    expect(mockEmailService.sendEmail).toHaveBeenCalledWith(body.email, process.env.RESET_PASSWORD_TEMPLATE_ID, { button_link });
    expect(Tokens.generateResetToken).toHaveBeenCalledWith(body.email);
  });

  it("should send a resend email to user and record in email table", async () => {
    const body = { email: "test@example.com" };
    const localEmailId = 1;
    const externalEmailId = 2;
    const mockReq = mockRequest({ body });
    const mockRes = mockResponse();

    mockUserRepository.findOne.mockResolvedValue({ ...body, id: 123 });
    mockEmailRepository.create.mockResolvedValue({ id: localEmailId });
    mockEmailService.sendEmail.mockResolvedValue(externalEmailId);
    jest.spyOn(Tokens, "generateResetToken").mockReturnValue({ resetToken: "resetToken" });

    await forgotPassword(mockReq, mockRes);

    const button_link = `${process.env.CLIENT_URL}/reset-password?token=resetToken`;
    expect(mockUserRepository.findOne).toHaveBeenCalledWith({ email: "test@example.com", googleId: null, facebookId: null });
    expect(mockEmailService.sendEmail).toHaveBeenCalledWith(body.email, process.env.RESET_PASSWORD_TEMPLATE_ID, { button_link });
    expect(mockEmailRepository.create).toHaveBeenCalledWith({ userId: 123, mailId: externalEmailId });
    expect(Tokens.generateResetToken).toHaveBeenCalledWith(body.email);
    expect(mockRes.status).toHaveBeenCalledWith(201);
    expect(mockRes.send).toHaveBeenCalledWith({ mailId: localEmailId });
  });
});
