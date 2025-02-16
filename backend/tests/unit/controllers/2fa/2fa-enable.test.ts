import { mockNext, mockRequest, mockResponse } from "../../__mocks__/express";
import { enable2fa } from "../../../../src/controllers/2fa.controllers";
import { ForbiddenError, NotFoundError } from "../../../../src/errors";
import { mockUserRepository } from "../../__mocks__/repositories";
import { IUserRepository, TYPES } from "../../../../src/types";
import { container } from "../../../../inversify.config";
import speakeasy from "speakeasy";

jest.mock("speakeasy");

describe("2FA / enable2fa Controller", () => {
  container.bind<IUserRepository>(TYPES.IUserRepository).toConstantValue(mockUserRepository);

  it("should throw not found error when user not found", async () => {
    mockUserRepository.findOne.mockResolvedValue(null);

    const mockReq = mockRequest({ body: { token: "123456" }, currentUser: { id: "123" } });
    const mockRes = mockResponse();

    await expect(enable2fa(mockReq, mockRes, mockNext())).rejects.toThrow(NotFoundError);

    expect(mockUserRepository.findOne).toHaveBeenCalledWith({ id: "123" });
  });

  it("should throw forbidden error when otp token is not valid", async () => {
    mockUserRepository.findOne.mockResolvedValue({ twoFactorSecret: "twoFactorSecret" });

    const mockReq = mockRequest({ body: { token: "123456" }, currentUser: { id: "123" } });
    const mockRes = mockResponse();

    jest.spyOn(speakeasy.totp, "verify").mockReturnValue(false);

    await expect(enable2fa(mockReq, mockRes, mockNext())).rejects.toThrow(ForbiddenError);

    expect(mockUserRepository.findOne).toHaveBeenCalledWith({ id: "123" });
    expect(mockUserRepository.update).toHaveBeenCalledWith("123", { twoFactorSecret: null });
    expect(speakeasy.totp.verify).toHaveBeenCalledWith({ secret: "twoFactorSecret", encoding: "base32", token: "123456" });
  });

  it("should enable 2fa on a user and call next()", async () => {
    mockUserRepository.findOne.mockResolvedValue({ id: "123", email: "test@example.com", twoFactorSecret: "twoFactorSecret" });

    const mockReq = mockRequest({ body: { token: "123456" }, currentUser: { id: "123" } });
    const mockRes = mockResponse();
    const next = mockNext;

    jest.spyOn(speakeasy.totp, "verify").mockReturnValue(true);

    await enable2fa(mockReq, mockRes, next);

    expect(mockReq.currentUser).toStrictEqual({
      id: "123",
      email: "test@example.com",
      is2FAEnabled: true,
      is2FAVerified: true,
      isOauth2User: false,
      isAdmin: false,
    });
    expect(mockUserRepository.findOne).toHaveBeenCalledWith({ id: "123" });
    expect(mockUserRepository.update).toHaveBeenCalledWith("123", { is2FAEnabled: true });
    expect(speakeasy.totp.verify).toHaveBeenCalledWith({ secret: "twoFactorSecret", encoding: "base32", token: "123456" });
    expect(mockNext).toHaveBeenCalled();
  });
});
