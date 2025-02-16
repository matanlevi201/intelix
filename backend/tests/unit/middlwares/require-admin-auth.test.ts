import { mockNext, mockRequest, mockResponse } from "../__mocks__/express";
import { NotAuthorizedError } from "../../../src/errors";
import { requireAdminAuth } from "../../../src/middlewares";
import { container } from "../../../inversify.config";
import { IUserRepository, TYPES } from "../../../src/types";
import { mockUserRepository } from "../__mocks__/repositories";
import { UserRole } from "../../../src/database/schema";

describe("MIDDLEWARES / require-admin-auth", () => {
  container.bind<IUserRepository>(TYPES.IUserRepository).toConstantValue(mockUserRepository);

  it("should throw not authorized error if there is no current user", async () => {
    const mockReq = mockRequest({ currentUser: null });
    const mockRes = mockResponse();
    const next = mockNext;

    await expect(() => requireAdminAuth(mockReq, mockRes, next)).rejects.toThrow(NotAuthorizedError);

    expect(mockReq.currentUser).toBe(null);
    expect(next).not.toHaveBeenCalled();
  });

  it("should throw not authorized error if current user is not an admin", async () => {
    const currentUser = { id: 1, email: "test@example.com" };
    const mockReq = mockRequest({ currentUser });
    const mockRes = mockResponse();
    const next = mockNext;

    mockUserRepository.findOne.mockResolvedValue({
      id: "123",
      email: "test@example.com",
      role: UserRole.USER,
    });

    await expect(() => requireAdminAuth(mockReq, mockRes, next)).rejects.toThrow(NotAuthorizedError);

    expect(mockUserRepository.findOne).toHaveBeenCalledWith({ id: currentUser.id });
    expect(next).not.toHaveBeenCalled();
  });

  it("should call next()", async () => {
    const currentUser = { id: 1, email: "test@example.com" };
    const mockReq = mockRequest({ currentUser });
    const mockRes = mockResponse();
    const next = mockNext;

    mockUserRepository.findOne.mockResolvedValue({
      id: "123",
      email: "test@example.com",
      role: UserRole.ADMIN,
    });

    await requireAdminAuth(mockReq, mockRes, next);

    expect(mockUserRepository.findOne).toHaveBeenCalledWith({ id: currentUser.id });
    expect(next).toHaveBeenCalled();
  });
});
