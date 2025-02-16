import { mockNext, mockRequest, mockResponse } from "../__mocks__/express";
import { NotAuthorizedError } from "../../../src/errors";
import { setSession } from "../../../src/middlewares";
import { Tokens } from "../../../src/utils";

jest.mock("../../../src/utils");

describe("MIDDLEWARES / set-session", () => {
  it("should set a user session and issue access token and refresh token", () => {
    const mockReq = mockRequest({ currentUser: { id: 1, email: "test@example.com" } });
    const mockRes = mockResponse();
    const next = mockNext;

    jest.spyOn(Tokens, "generateRefreshToken").mockReturnValue({ refreshToken: "refreshToken" });
    jest.spyOn(Tokens, "generateAccessToken").mockReturnValue({ accessToken: "accessToken" });

    setSession(mockReq, mockRes, next);

    expect(mockRes.cookie).toHaveBeenCalledWith("refreshToken", "refreshToken", { httpOnly: true, secure: false });
    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.send).toHaveBeenCalledWith({ accessToken: "accessToken" });
  });
});
