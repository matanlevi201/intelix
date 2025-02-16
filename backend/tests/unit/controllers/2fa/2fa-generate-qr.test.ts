import { generate2faQr } from "../../../../src/controllers/2fa.controllers";
import { mockRequest, mockResponse } from "../../__mocks__/express";
import { mockUserRepository } from "../../__mocks__/repositories";
import { IUserRepository, TYPES } from "../../../../src/types";
import { container } from "../../../../inversify.config";
import { BadRequestError } from "../../../../src/errors";
import speakeasy from "speakeasy";

describe("2FA / generate2faQr Controller", () => {
  container.bind<IUserRepository>(TYPES.IUserRepository).toConstantValue(mockUserRepository);

  it("should throw bad request error when user 2fa secret failed to update", async () => {
    const mockReq = mockRequest({ currentUser: { id: "123" } });
    const mockRes = mockResponse();

    jest.spyOn(speakeasy, "generateSecret").mockReturnValue({ base32: "base32", otpauth_url: "otpauth_url" } as any);
    jest.spyOn(mockUserRepository, "update").mockReturnValue(null);

    await expect(generate2faQr(mockReq, mockRes)).rejects.toThrow(BadRequestError);
  });

  it("should return 200, qr, and manual link to 2fa authenticator", async () => {
    const mockReq = mockRequest({ currentUser: { id: "123" } });
    const mockRes = mockResponse();

    jest.spyOn(speakeasy, "generateSecret").mockReturnValue({ base32: "base32", otpauth_url: "otpauth_url" } as any);
    jest.spyOn(mockUserRepository, "update").mockReturnValue({ id: "123" });

    await generate2faQr(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.send).toHaveBeenCalledWith({ secret: "base32", qr: "otpauth_url" });
  });
});
