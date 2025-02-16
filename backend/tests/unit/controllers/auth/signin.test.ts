import { mockNext, mockRequest, mockResponse } from "../../__mocks__/express";
import { signin } from "../../../../src/controllers/auth.controllers";
import { mockUserRepository } from "../../__mocks__/repositories";
import { IUserRepository, TYPES } from "../../../../src/types";
import { BadRequestError } from "../../../../src/errors";
import { container } from "../../../../inversify.config";
import { Password, Tokens } from "../../../../src/utils";

describe("AUTH / signin Controller", () => {
  container.bind<IUserRepository>(TYPES.IUserRepository).toConstantValue(mockUserRepository);

  it("should throw bad request error when user provided wrong email", async () => {
    const email = "test@example.com";
    mockUserRepository.findOne.mockResolvedValue(null);
    const mockReq = mockRequest({ body: { email, password: "123" } });

    await expect(signin(mockReq, mockResponse(), mockNext)).rejects.toThrow(BadRequestError);

    expect(mockUserRepository.findOne).toHaveBeenCalledWith({ email: "test@example.com" });
    expect(mockUserRepository.create).not.toHaveBeenCalled();
  });

  it("should throw bad request error when user provided wrong password", async () => {
    const email = "test@example.com";
    mockUserRepository.findOne.mockResolvedValue({ id: 1, email, password: "123", is2FAEnabled: false });

    jest.spyOn(Password, "compare").mockResolvedValue(false);

    const mockReq = mockRequest({ body: { email, password: "123" } });

    await expect(signin(mockReq, mockResponse(), mockNext)).rejects.toThrow(BadRequestError);

    expect(mockUserRepository.findOne).toHaveBeenCalledWith({ email: "test@example.com" });
    expect(mockUserRepository.create).not.toHaveBeenCalled();
  });

  it("should sign in the user and call next() witn 2fa disabled", async () => {
    const email = "test@example.com";
    mockUserRepository.findOne.mockResolvedValue({ id: 1, email, password: "123", is2FAEnabled: false });

    jest.spyOn(Password, "compare").mockResolvedValue(true);

    const mockReq = mockRequest({ body: { email, password: "123" } });

    await signin(mockReq, mockResponse(), mockNext);

    expect(mockReq.currentUser).toStrictEqual({
      id: 1,
      email,
      is2FAEnabled: false,
      is2FAVerified: false,
      isOauth2User: false,
    });
    expect(mockUserRepository.findOne).toHaveBeenCalledWith({ email: "test@example.com" });
    expect(mockNext).toHaveBeenCalled();
  });

  it("should sign in a user, not call next(), return temp access token", async () => {
    const email = "test@example.com";
    mockUserRepository.findOne.mockResolvedValue({ id: 1, email, password: "123", is2FAEnabled: true });

    jest.spyOn(Password, "compare").mockResolvedValue(true);
    jest.spyOn(Tokens, "generateTemp2FAToken").mockReturnValue({ temp2FAToken: "temp2FAToken" });

    const mockReq = mockRequest({ body: { email, password: "123" } });
    const mockRes = mockResponse();

    await signin(mockReq, mockRes, mockNext);

    expect(mockReq.currentUser).not.toBeDefined();
    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.send).toHaveBeenCalledWith({ accessToken: "temp2FAToken" });
    expect(mockUserRepository.findOne).toHaveBeenCalledWith({ email: "test@example.com" });
    expect(mockNext).not.toHaveBeenCalled();
  });
});
