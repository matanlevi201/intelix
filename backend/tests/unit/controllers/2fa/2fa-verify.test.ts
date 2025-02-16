import { BadRequestError, ForbiddenError, NotFoundError } from "../../../../src/errors";
import { mockNext, mockRequest, mockResponse } from "../../__mocks__/express";
import { verify2fa } from "../../../../src/controllers/2fa.controllers";
import { mockUserRepository } from "../../__mocks__/repositories";
import { IUserRepository, TYPES } from "../../../../src/types";
import { container } from "../../../../inversify.config";
import speakeasy from "speakeasy";

jest.mock("speakeasy");

describe("2FA / verify2fa Controller", () => {
  container.bind<IUserRepository>(TYPES.IUserRepository).toConstantValue(mockUserRepository);

  it("should throw not found error when user not found", async () => {
    mockUserRepository.findOne.mockResolvedValue(null);

    const mockReq = mockRequest({ body: { token: "123456" }, currentUser: { id: "123" } });
    const mockRes = mockResponse();

    await expect(verify2fa(mockReq, mockRes, mockNext())).rejects.toThrow(NotFoundError);

    expect(mockUserRepository.findOne).toHaveBeenCalledWith({ id: "123" });
  });

  it("should throw bad request error when 2fa is not even enabled", async () => {
    mockUserRepository.findOne.mockResolvedValue({ is2FAEnabled: false });

    const mockReq = mockRequest({ body: { token: "123456" }, currentUser: { id: "123" } });
    const mockRes = mockResponse();

    await expect(verify2fa(mockReq, mockRes, mockNext())).rejects.toThrow(BadRequestError);

    expect(mockUserRepository.findOne).toHaveBeenCalledWith({ id: "123" });
  });

  it("should throw forbidden error when otp token is not valid", async () => {
    mockUserRepository.findOne.mockResolvedValue({
      id: "123",
      email: "test@example.com",
      twoFactorSecret: "twoFactorSecret",
      is2FAEnabled: true,
    });

    jest.spyOn(speakeasy.totp, "verify").mockReturnValue(false);

    const mockReq = mockRequest({ body: { token: "123456" }, currentUser: { id: "123" } });
    const mockRes = mockResponse();

    await expect(verify2fa(mockReq, mockRes, mockNext())).rejects.toThrow(ForbiddenError);

    expect(mockUserRepository.findOne).toHaveBeenCalledWith({ id: "123" });
    expect(speakeasy.totp.verify).toHaveBeenCalledWith({ secret: "twoFactorSecret", encoding: "base32", token: "123456" });
  });

  it("should verify 2fa on a user and call next()", async () => {
    mockUserRepository.findOne.mockResolvedValue({
      id: "123",
      email: "test@example.com",
      twoFactorSecret: "twoFactorSecret",
      is2FAEnabled: true,
    });

    jest.spyOn(speakeasy.totp, "verify").mockReturnValue(true);

    const mockReq = mockRequest({ body: { token: "123456" }, currentUser: { id: "123" } });
    const mockRes = mockResponse();

    await verify2fa(mockReq, mockRes, mockNext);

    expect(mockReq.currentUser).toStrictEqual({
      id: "123",
      email: "test@example.com",
      is2FAEnabled: true,
      is2FAVerified: true,
      isOauth2User: false,
      isAdmin: false,
    });
    expect(mockUserRepository.findOne).toHaveBeenCalledWith({ id: "123" });
    expect(speakeasy.totp.verify).toHaveBeenCalledWith({ secret: "twoFactorSecret", encoding: "base32", token: "123456" });
    expect(mockNext).toHaveBeenCalled();
  });
});
