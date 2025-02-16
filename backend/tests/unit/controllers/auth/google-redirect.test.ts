import { googleRedirect } from "../../../../src/controllers/auth.controllers";
import { mockRequest, mockResponse, mockNext } from "../../__mocks__/express";
import { mockUserRepository } from "../../__mocks__/repositories";
import { IUserRepository, TYPES } from "../../../../src/types";
import { container } from "../../../../inversify.config";
import { Tokens } from "../../../../src/utils";

jest.mock("../../../../src/utils");

describe("AUTH / googleRedirect Controller", () => {
  container.bind<IUserRepository>(TYPES.IUserRepository).toConstantValue(mockUserRepository);

  it("should set session on oauth2 user", async () => {
    const mockReq = mockRequest({ user: { id: 123, email: "test@example.com" } });
    const mockRes = mockResponse();
    const next = mockNext();

    jest.spyOn(Tokens, "generateRefreshToken").mockReturnValue({ refreshToken: "refreshToken" });
    jest.spyOn(Tokens, "generateAccessToken").mockReturnValue({ accessToken: "accessToken" });

    await googleRedirect(mockReq, mockRes, next);

    const userPayload = { id: 123, email: "test@example.com", is2FAEnabled: false, is2FAVerified: false, isOauth2User: true };

    expect(Tokens.generateRefreshToken).toHaveBeenCalledWith(userPayload);
    expect(Tokens.generateAccessToken).toHaveBeenCalledWith(userPayload);
    expect(mockRes.cookie).toHaveBeenCalledWith("refreshToken", "refreshToken", { httpOnly: true, secure: false });
    expect(mockRes.send).toHaveBeenCalledWith({ accessToken: "accessToken" });
    expect(mockRes.status).toHaveBeenCalledWith(200);
  });
});
