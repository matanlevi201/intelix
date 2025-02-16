import { mockNext, mockRequest, mockResponse } from "../../__mocks__/express";
import { disable2fa } from "../../../../src/controllers/2fa.controllers";
import { BadRequestError, ForbiddenError } from "../../../../src/errors";
import { mockUserRepository } from "../../__mocks__/repositories";
import { IUserRepository, TYPES } from "../../../../src/types";
import { container } from "../../../../inversify.config";
import speakeasy from "speakeasy";

jest.mock("speakeasy");

describe("2FA / disable2fa Controller", () => {
  container.bind<IUserRepository>(TYPES.IUserRepository).toConstantValue(mockUserRepository);

  it("should throw forbidden error when otp token is not valid", async () => {
    mockUserRepository.findOne.mockResolvedValue({
      id: "123",
      email: "test@example.com",
      twoFactorSecret: "twoFactorSecret",
      is2FAEnabled: true,
    });

    const mockReq = mockRequest({ body: { token: "123456" }, currentUser: { id: "123" } });
    const mockRes = mockResponse();

    jest.spyOn(speakeasy.totp, "verify").mockReturnValue(false);

    await expect(disable2fa(mockReq, mockRes, mockNext())).rejects.toThrow(ForbiddenError);

    expect(mockUserRepository.findOne).toHaveBeenCalledWith({ id: "123" });
    expect(speakeasy.totp.verify).toHaveBeenCalledWith({ secret: "twoFactorSecret", encoding: "base32", token: "123456" });
  });

  it("should throw bad request error when user has not updated correctly", async () => {
    mockUserRepository.findOne.mockResolvedValue({
      id: "123",
      email: "test@example.com",
      twoFactorSecret: "twoFactorSecret",
      is2FAEnabled: true,
    });
    mockUserRepository.update.mockResolvedValue(null);

    const mockReq = mockRequest({ body: { token: "123456" }, currentUser: { id: "123" } });
    const mockRes = mockResponse();

    jest.spyOn(speakeasy.totp, "verify").mockReturnValue(true);

    await expect(disable2fa(mockReq, mockRes, mockNext())).rejects.toThrow(BadRequestError);

    expect(mockUserRepository.findOne).toHaveBeenCalledWith({ id: "123" });
    expect(mockUserRepository.update).toHaveBeenCalledWith("123", { is2FAEnabled: false, twoFactorSecret: null });
    expect(speakeasy.totp.verify).toHaveBeenCalledWith({ secret: "twoFactorSecret", encoding: "base32", token: "123456" });
  });
});
