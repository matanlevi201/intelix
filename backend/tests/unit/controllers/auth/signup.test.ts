import { mockNext, mockRequest, mockResponse } from "../../__mocks__/express";
import { signup } from "../../../../src/controllers/auth.controllers";
import { mockUserRepository } from "../../__mocks__/repositories";
import { IUserRepository, TYPES } from "../../../../src/types";
import { BadRequestError } from "../../../../src/errors";
import { container } from "../../../../inversify.config";
import { Password } from "../../../../src/utils";

describe("AUTH / signup Controller", () => {
  container.bind<IUserRepository>(TYPES.IUserRepository).toConstantValue(mockUserRepository);

  it("should throw bad request error when user already exits", async () => {
    const existingEmail = "test@example.com";
    mockUserRepository.findOne.mockResolvedValue({ email: existingEmail });
    const mockReq = mockRequest({ body: { email: existingEmail, password: "123" } });

    await expect(signup(mockReq, mockResponse(), mockNext)).rejects.toThrow(BadRequestError);

    expect(mockUserRepository.findOne).toHaveBeenCalledWith({ email: "test@example.com" });
    expect(mockUserRepository.create).not.toHaveBeenCalled();
  });

  it("should create a new user and call next()", async () => {
    mockUserRepository.findOne.mockResolvedValue(null); // No existing user
    mockUserRepository.create.mockResolvedValue({ id: "123", email: "test@example.com", is2FAEnabled: false });

    jest.spyOn(Password, "toHash").mockResolvedValue("hashedPassword123");

    const mockReq = mockRequest({ body: { email: "test@example.com", password: "password123" } });

    await signup(mockReq, mockResponse(), mockNext);

    expect(mockReq.currentUser).toStrictEqual({
      id: "123",
      email: "test@example.com",
      is2FAEnabled: false,
      is2FAVerified: false,
      isOauth2User: false,
      isAdmin: false,
    });
    expect(mockUserRepository.findOne).toHaveBeenCalledWith({ email: "test@example.com" });
    expect(mockUserRepository.create).toHaveBeenCalledWith({ email: "test@example.com", password: "hashedPassword123" });
    expect(mockNext).toHaveBeenCalled();
  });
});
