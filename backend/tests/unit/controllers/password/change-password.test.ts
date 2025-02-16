import { changePassword } from "../../../../src/controllers/password.controllers";
import { BadRequestError, NotFoundError } from "../../../../src/errors";
import { mockRequest, mockResponse } from "../../__mocks__/express";
import { mockUserRepository } from "../../__mocks__/repositories";
import { IUserRepository, TYPES } from "../../../../src/types";
import { container } from "../../../../inversify.config";
import { Password } from "../../../../src/utils";

jest.mock("../../../../src/utils");

describe("PASSWORD / changePassword Controller", () => {
  container.bind<IUserRepository>(TYPES.IUserRepository).toConstantValue(mockUserRepository);

  it("should throw not found error when user not found", async () => {
    mockUserRepository.findOne.mockResolvedValue(null);

    const mockReq = mockRequest({ body: { currentPassword: "123456", newPassword: "654321" }, currentUser: { id: "123" } });
    const mockRes = mockResponse();

    await expect(changePassword(mockReq, mockRes)).rejects.toThrow(NotFoundError);

    expect(mockUserRepository.findOne).toHaveBeenCalledWith({ id: "123" });
  });

  it("should throw bad request error when provided password is incorrect", async () => {
    const body = { currentPassword: "123456", newPassword: "654321" };
    mockUserRepository.findOne.mockResolvedValue({ password: body.newPassword });
    const mockReq = mockRequest({ body, currentUser: { id: "123" } });
    const mockRes = mockResponse();

    jest.spyOn(Password, "compare").mockResolvedValue(false);

    await expect(changePassword(mockReq, mockRes)).rejects.toThrow(BadRequestError);

    expect(mockUserRepository.findOne).toHaveBeenCalledWith({ id: "123" });
    expect(Password.compare).toHaveBeenCalledWith(body.newPassword, body.currentPassword);
  });

  it("should change the current password of the user", async () => {
    const body = { currentPassword: "123456", newPassword: "654321" };
    mockUserRepository.findOne.mockResolvedValue({ id: "123", password: body.currentPassword });
    const mockReq = mockRequest({ body, currentUser: { id: "123" } });
    const mockRes = mockResponse();

    jest.spyOn(Password, "compare").mockResolvedValue(true);
    jest.spyOn(Password, "toHash").mockResolvedValue(body.newPassword);

    await changePassword(mockReq, mockRes);

    expect(mockUserRepository.findOne).toHaveBeenCalledWith({ id: "123" });
    expect(mockUserRepository.update).toHaveBeenCalledWith("123", { password: body.newPassword });
    expect(Password.compare).toHaveBeenCalledWith(body.currentPassword, body.currentPassword);
    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.send).toHaveBeenCalledWith();
  });
});
