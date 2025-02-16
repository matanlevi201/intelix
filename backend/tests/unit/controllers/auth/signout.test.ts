import { container } from "../../../../inversify.config";
import { IBlacklistRepository, IUserRepository, TYPES } from "../../../../src/types";
import { mockBlacklistRepository, mockUserRepository } from "../../__mocks__/repositories";
import { mockRequest, mockResponse } from "../../__mocks__/express";
import { signout } from "../../../../src/controllers/auth.controllers";

describe("AUTH / signout Controller", () => {
  container.bind<IUserRepository>(TYPES.IUserRepository).toConstantValue(mockUserRepository);
  container.bind<IBlacklistRepository>(TYPES.IBlacklistRepository).toConstantValue(mockBlacklistRepository);

  it("should clear the refresh token cookie and mark it as blacklisted", async () => {
    const refreshToken = "to_be_blacklisted";
    const mockReq = mockRequest({ body: {}, cookies: { refreshToken } });
    const mockRes = mockResponse();

    await signout(mockReq, mockRes);

    expect(mockBlacklistRepository.create).toHaveBeenCalledWith({ token: refreshToken });
    expect(mockRes.status).toHaveBeenCalledWith(205);
    expect(mockRes.clearCookie).toHaveBeenCalledWith("refreshToken");
  });
});
