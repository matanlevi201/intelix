import { refreshToken } from "../../../../src/controllers/auth.controllers";
import { mockRequest, mockResponse } from "../../__mocks__/express";
import { NotAuthorizedError, NotFoundError } from "../../../../src/errors";
import { mockUserRepository } from "../../__mocks__/repositories";
import { IUserRepository, TYPES } from "../../../../src/types";
import { container } from "../../../../inversify.config";
import { Tokens } from "../../../../src/utils";
import jwt from "jsonwebtoken";

jest.mock("../../../../src/utils");

describe("AUTH / refreshToken Controller", () => {
  container.bind<IUserRepository>(TYPES.IUserRepository).toConstantValue(mockUserRepository);

  it("should throw not authorized error when user session has ended", async () => {
    const mockReq = mockRequest({ cookies: { refreshToken: null } });
    const mockRes = mockResponse();

    jest.spyOn(jwt, "verify").mockImplementation(() => {
      throw new Error("Invalid token");
    });

    await expect(refreshToken(mockReq, mockRes)).rejects.toThrow(NotAuthorizedError);

    expect(mockRes.clearCookie).toHaveBeenCalledWith("refreshToken");
  });

  it("should throw not found error when user not found", async () => {
    mockUserRepository.findOne.mockResolvedValue(null);

    const mockReq = mockRequest({ cookies: { refreshToken: "refreshToken" } });
    const mockRes = mockResponse();

    jest.spyOn(jwt, "verify").mockImplementation(() => ({
      id: "123",
      email: "test@example.com",
      is2FAEnabled: false,
      is2FAVerified: false,
      isOauth2User: false,
    }));

    await expect(refreshToken(mockReq, mockRes)).rejects.toThrow(NotFoundError);

    expect(mockUserRepository.findOne).toHaveBeenCalledWith({ id: "123" });
  });

  it("should refresh a user session and generate access token", async () => {
    mockUserRepository.findOne.mockResolvedValue({
      id: "123",
      email: "test@example.com",
    });

    const mockReq = mockRequest({ cookies: { refreshToken: "refreshToken" } });
    const mockRes = mockResponse();

    jest.spyOn(jwt, "verify").mockImplementation(() => ({
      id: "321",
      email: "test@example2.com",
      is2FAEnabled: false,
      is2FAVerified: false,
      isOauth2User: false,
    }));

    jest.spyOn(Tokens, "generateAccessToken").mockReturnValue({ accessToken: "accessToken" });

    await refreshToken(mockReq, mockRes);

    expect(mockUserRepository.findOne).toHaveBeenCalledWith({ id: "321" });
    expect(Tokens.generateAccessToken).toHaveBeenCalledWith({
      id: "123",
      email: "test@example.com",
      is2FAEnabled: false,
      is2FAVerified: false,
      isOauth2User: false,
      isAdmin: false,
    });

    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.send).toHaveBeenCalledWith({ accessToken: "accessToken" });
  });
});
