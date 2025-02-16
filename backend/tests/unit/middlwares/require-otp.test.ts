import { mockNext, mockRequest, mockResponse } from "../__mocks__/express";
import { NotAuthorizedError } from "../../../src/errors";
import { requireOtp } from "../../../src/middlewares";

describe("MIDDLEWARES / require-otp", () => {
  it("should throw not authorized error if user is not otp verified", () => {
    const mockReq = mockRequest({ currentUser: { is2FAEnabled: true, is2FAVerified: false } });
    const mockRes = mockResponse();
    const next = mockNext;

    expect(() => requireOtp(mockReq, mockRes, next)).toThrow(NotAuthorizedError);

    expect(mockReq.currentUser.is2FAEnabled).toBe(true);
    expect(mockReq.currentUser.is2FAVerified).toBe(false);
    expect(next).not.toHaveBeenCalled();
  });

  it("should call next()", () => {
    const mockReq = mockRequest({ currentUser: { is2FAEnabled: true, is2FAVerified: true } });
    const mockRes = mockResponse();
    const next = mockNext;

    requireOtp(mockReq, mockRes, next);

    expect(mockReq.currentUser.is2FAEnabled).toBe(true);
    expect(mockReq.currentUser.is2FAVerified).toBe(true);
    expect(next).toHaveBeenCalledTimes(1);
  });

  it("should call next()", () => {
    const mockReq = mockRequest({ currentUser: { is2FAEnabled: false, is2FAVerified: false } });
    const mockRes = mockResponse();
    const next = mockNext;

    requireOtp(mockReq, mockRes, next);

    expect(mockReq.currentUser.is2FAEnabled).toBe(false);
    expect(mockReq.currentUser.is2FAVerified).toBe(false);
    expect(next).toHaveBeenCalledTimes(1);
  });
});
