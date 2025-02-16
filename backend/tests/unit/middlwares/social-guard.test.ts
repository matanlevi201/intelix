import { mockNext, mockRequest, mockResponse } from "../__mocks__/express";
import { socialGuard } from "../../../src/middlewares";
import { ForbiddenError } from "../../../src/errors";

describe("MIDDLEWARES / social-guard", () => {
  it("should throw forbidden error when route is not available to oauth users", () => {
    const mockReq = mockRequest({ currentUser: { isOauth2User: true } });
    const mockRes = mockResponse();
    const next = mockNext;

    expect(() => socialGuard(mockReq, mockRes, next)).toThrow(ForbiddenError);

    expect(next).not.toHaveBeenCalled();
  });

  it("should call next()", () => {
    const mockReq = mockRequest({ currentUser: { isOauth2User: false } });
    const mockRes = mockResponse();
    const next = mockNext;

    socialGuard(mockReq, mockRes, next);

    expect(next).toHaveBeenCalledTimes(1);
  });
});
