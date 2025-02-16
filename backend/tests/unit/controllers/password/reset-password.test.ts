import { BadRequestError, ForbiddenError, NotFoundError } from "../../../../src/errors";
import { resetPassword } from "../../../../src/controllers/password.controllers";
import { mockRequest, mockResponse } from "../../__mocks__/express";
import { mockUserRepository } from "../../__mocks__/repositories";
import { IUserRepository, TYPES } from "../../../../src/types";
import { container } from "../../../../inversify.config";
import { Password } from "../../../../src/utils";
import jwt from "jsonwebtoken";

jest.mock("../../../../src/utils");

describe("PASSWORD / resetPassword Controller", () => {
  container.bind<IUserRepository>(TYPES.IUserRepository).toConstantValue(mockUserRepository);

  it("should throw bad request error when reset token was not provided", async () => {
    const mockReq = mockRequest({ query: { resetToken: null }, body: { password: "123456" } });
    const mockRes = mockResponse();

    await expect(resetPassword(mockReq, mockRes)).rejects.toThrow(BadRequestError);
  });

  it("should throw forbidden error when reset token is invalid", async () => {
    const mockReq = mockRequest({ query: { resetToken: "resetToken" }, body: { password: "123456" } });
    const mockRes = mockResponse();

    jest.spyOn(jwt, "verify").mockImplementation(() => {
      throw new Error("Testing error");
    });

    await expect(resetPassword(mockReq, mockRes)).rejects.toThrow(ForbiddenError);
  });

  it("should throw not found error when user was not found", async () => {
    mockUserRepository.findOne.mockResolvedValue(null);
    const mockReq = mockRequest({ query: { resetToken: "resetToken" }, body: { password: "123456" } });
    const mockRes = mockResponse();

    jest.spyOn(jwt, "verify").mockImplementation(() => ({ email: "test@example.com" }));

    await expect(resetPassword(mockReq, mockRes)).rejects.toThrow(NotFoundError);

    expect(mockUserRepository.findOne).toHaveBeenCalledWith({ email: "test@example.com" });
  });

  it("should throw not found error when user was not found", async () => {
    const body = { password: "123456" };
    mockUserRepository.findOne.mockResolvedValue({ id: 1 });
    const mockReq = mockRequest({ query: { resetToken: "resetToken" }, body });
    const mockRes = mockResponse();

    jest.spyOn(jwt, "verify").mockImplementation(() => ({ email: "test@example.com" }));
    jest.spyOn(Password, "toHash").mockResolvedValue(body.password);

    await resetPassword(mockReq, mockRes);

    expect(mockUserRepository.findOne).toHaveBeenCalledWith({ email: "test@example.com" });
    expect(mockUserRepository.update).toHaveBeenCalledWith(1, { password: body.password });
    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.send).toHaveBeenCalledWith();
  });
});
