import { mockNext, mockRequest, mockResponse } from "../__mocks__/express";
import { RequestValidationError } from "../../../src/errors";
import { validateRequest } from "../../../src/middlewares";
import { z } from "zod";

describe("MIDDLEWARES / validate-request", () => {
  it("should throw request validation error", () => {
    const schema = z.object({
      id: z.string(),
    });
    const validationMiddlware = validateRequest(schema);
    const mockReq = mockRequest({ body: { id: 1 } });
    const mockRes = mockResponse();
    const next = mockNext;

    expect(() => validationMiddlware(mockReq, mockRes, next)).toThrow(RequestValidationError);

    expect(next).not.toHaveBeenCalled();
  });

  it("should throw fall back general error", () => {
    const schema = z.object({
      id: z.string(),
    });
    const validationMiddlware = validateRequest(schema);
    const mockReq = mockRequest({ body: { id: 1 } });
    const mockRes = mockResponse();
    const next = mockNext;

    jest.spyOn(schema, "parse").mockImplementation(() => {
      throw new Error("Unexpected failure");
    });
    expect(() => validationMiddlware(mockReq, mockRes, next)).toThrow(Error);

    expect(next).not.toHaveBeenCalled();
  });

  it("should call next()", () => {
    const schema = z.object({
      id: z.string(),
    });
    const validationMiddlware = validateRequest(schema);
    schema.parse({ id: "1" });
    const mockReq = mockRequest({ body: { id: "1" } });
    const mockRes = mockResponse();
    const next = mockNext;

    validationMiddlware(mockReq, mockRes, next);

    expect(next).toHaveBeenCalledTimes(1);
  });
});
