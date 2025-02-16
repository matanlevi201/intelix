import { mockNext, mockRequest, mockResponse } from "../__mocks__/express";
import { mockBlacklistRepository } from "../__mocks__/repositories";
import { IBlacklistRepository, TYPES } from "../../../src/types";
import { blacklistGuard } from "../../../src/middlewares";
import { ForbiddenError } from "../../../src/errors";
import { container } from "../../../inversify.config";

describe("MIDDLEWARES / blacklist-guard", () => {
  container.bind<IBlacklistRepository>(TYPES.IBlacklistRepository).toConstantValue(mockBlacklistRepository);

  it("should throw forbidden error refresh token is blacklisted", async () => {
    const blacklistedToken = "blacklisted_token";
    const mockReq = mockRequest({ cookies: { refreshToken: blacklistedToken } });
    const mockRes = mockResponse();
    const next = mockNext;

    mockBlacklistRepository.findOne.mockResolvedValue({ token: blacklistedToken });

    await expect(blacklistGuard(mockReq, mockRes, next)).rejects.toThrow(ForbiddenError);

    expect(mockBlacklistRepository.findOne).toHaveBeenCalledWith({ token: blacklistedToken });
    expect(next).not.toHaveBeenCalled();
  });

  it("should call next()", async () => {
    const blacklistedToken = "not_blacklisted_token";
    const mockReq = mockRequest({ cookies: { refreshToken: blacklistedToken } });
    const mockRes = mockResponse();
    const next = mockNext;

    mockBlacklistRepository.findOne.mockResolvedValue(null);

    await blacklistGuard(mockReq, mockRes, next);

    expect(mockBlacklistRepository.findOne).toHaveBeenCalledWith({ token: blacklistedToken });
    expect(next).toHaveBeenCalled();
  });
});
