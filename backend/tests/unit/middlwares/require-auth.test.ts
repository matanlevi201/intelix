import { mockNext, mockRequest, mockResponse } from "../__mocks__/express";
import { NotAuthorizedError } from "../../../src/errors";
import { requireAuth } from "../../../src/middlewares";

describe("MIDDLEWARES / require-auth", () => {
  it("should throw not authorized error if there is no current user", () => {
    const mockReq = mockRequest({ currentUser: null });
    const mockRes = mockResponse();
    const next = mockNext;

    expect(() => requireAuth(mockReq, mockRes, next)).toThrow(NotAuthorizedError);

    expect(mockReq.currentUser).toBe(null);
    expect(next).not.toHaveBeenCalled();
  });

  it("should call next()", () => {
    const mockReq = mockRequest({ currentUser: { id: 1, email: "test@example.com" } });
    const mockRes = mockResponse();
    const next = mockNext;

    requireAuth(mockReq, mockRes, next);

    expect(mockReq.currentUser.id).toBe(1);
    expect(mockReq.currentUser.email).toBe("test@example.com");
    expect(next).toHaveBeenCalledTimes(1);
  });
});
