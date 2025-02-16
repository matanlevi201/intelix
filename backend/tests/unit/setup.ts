import "dotenv/config";
import { jest } from "@jest/globals";
import { container } from "../../inversify.config";

beforeEach(() => {
  jest.clearAllMocks();
});

afterAll(() => {
  jest.clearAllMocks();
  container.unbindAll();
});
