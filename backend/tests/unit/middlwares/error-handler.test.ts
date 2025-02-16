import { mockNext, mockRequest, mockResponse } from "../__mocks__/express";
import { BadRequestError, CustomError } from "../../../src/errors";
import { errorHandler } from "../../../src/middlewares";

describe("MIDDLEWARES / error-handler", () => {
  it("should parse and return an instance of custom error", () => {
    const errorMessage = "Custom error message";
    const customError = new BadRequestError(errorMessage);
    const mockReq = mockRequest({});
    const mockRes = mockResponse();
    const next = mockNext;

    jest.spyOn(customError, "serializeErrors").mockReturnValue([{ message: errorMessage }]);

    errorHandler(customError, mockReq, mockRes, next);

    expect(customError instanceof CustomError).toBe(true);
    expect(mockRes.status).toHaveBeenCalledWith(customError.statusCode);
    expect(mockRes.send).toHaveBeenCalledWith({ errors: [{ message: errorMessage }] });
  });

  it("should fall back to general error response", () => {
    const errorMessage = "Something went wrong";
    const customError = new Error(errorMessage);

    const mockReq = mockRequest({});
    const mockRes = mockResponse();
    const next = mockNext;

    errorHandler(customError, mockReq, mockRes, next);

    expect(customError instanceof CustomError).toBe(false);
    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.send).toHaveBeenCalledWith({ errors: [{ message: errorMessage }] });
  });
});
