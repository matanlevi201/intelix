import { mockNext, mockRequest, mockResponse } from "../__mocks__/express";
import { currentUser } from "../../../src/middlewares";
import jwt from "jsonwebtoken";

jest.mock("jsonwebtoken");

describe("MIDDLEWARES / current-user", () => {
  it("should not attach a user to the request and call next()", () => {
    const mockReq = mockRequest({ headers: { authorization: "" } });
    const mockRes = mockResponse();
    const next = mockNext;

    currentUser(mockReq, mockRes, next);

    expect(mockReq.currentUser).not.toBeDefined();
    expect(next).toHaveBeenCalledTimes(1);
  });

  it("should attach a user to the request and call next()", () => {
    const mockReq = mockRequest({ headers: { authorization: "Bearer token" } });
    const mockRes = mockResponse();
    const next = mockNext;

    const user = { id: "123", email: "test@example.com", is2FAEnabled: false, is2FAVerified: false, isOauth2User: false };

    jest.spyOn(jwt, "verify").mockImplementation(() => user);

    currentUser(mockReq, mockRes, next);

    expect(mockReq.currentUser).toStrictEqual(user);
    expect(jwt.verify).toHaveBeenCalledWith("token", process.env.ACCESS_JWT_KEY);
    expect(next).toHaveBeenCalledTimes(1);
  });
});
