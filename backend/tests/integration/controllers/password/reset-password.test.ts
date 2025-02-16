import request from "supertest";
import { IUserRepository, TYPES } from "../../../../src/types";
import { container } from "../../../../inversify.config";
import { Password } from "../../../../src/utils/index";
import { app } from "../../../../src/app";
import jwt from "jsonwebtoken";

const BASE_URL = "/password";

describe(`PUT ${BASE_URL}/reset`, () => {
  it("returns 400 when no reset token", async () => {
    await request(app).put(`${BASE_URL}/reset`).send({ password: "123456789" }).expect(400);
  });

  it("returns 403 when token is not valid", async () => {
    await request(app).put(`${BASE_URL}/reset?resetToken=invalid_token`).send({ password: "123456789" }).expect(403);
  });

  it("returns 403 when token is expired", async () => {
    const expiredResetToken = jwt.sign({ id: 1, email: "test@test.com" }, process.env.RESET_JWT_KEY!, { expiresIn: -10 });
    await request(app).put(`${BASE_URL}/reset?resetToken=${expiredResetToken}`).send({ password: "123456789" }).expect(403);
  });

  it("returns 406 when provided password is invalid", async () => {
    const resetToken = jwt.sign({ id: 1, email: "test@test.com" }, process.env.RESET_JWT_KEY!, { expiresIn: "5m" });
    await request(app).put(`${BASE_URL}/reset?resetToken=${resetToken}`).send({ password: "" }).expect(406);
    await request(app).put(`${BASE_URL}/reset?resetToken=${resetToken}`).send({ password: "123" }).expect(406);
    await request(app).put(`${BASE_URL}/reset?resetToken=${resetToken}`).send({ password: 123 }).expect(406);
    await request(app).put(`${BASE_URL}/reset?resetToken=${resetToken}`).send({ password: {} }).expect(406);
    await request(app).put(`${BASE_URL}/reset?resetToken=${resetToken}`).send({ password: [] }).expect(406);
  });

  it("returns 404 when user not found", async () => {
    const resetToken = jwt.sign({ id: 1, email: "test@test.com" }, process.env.RESET_JWT_KEY!, { expiresIn: "5m" });
    await request(app).put(`${BASE_URL}/reset?resetToken=${resetToken}`).send({ password: "123456789" }).expect(404);
  });

  it("returns 200 when password was reset successfully", async () => {
    const userRepository = container.get<IUserRepository>(TYPES.IUserRepository);
    const updatedPassword = "987654321";
    const user = await userRepository.create({ email: "test@test.com", password: "123456789" });
    const resetToken = jwt.sign({ id: user.id, email: user.email }, process.env.RESET_JWT_KEY!, { expiresIn: "5m" });
    await request(app).put(`${BASE_URL}/reset?resetToken=${resetToken}`).send({ password: updatedPassword }).expect(200);
    const updatedUser = await userRepository.findOne({ id: user.id });
    const isPasswordUpdated = await Password.compare(updatedUser.password!, updatedPassword);
    expect(isPasswordUpdated).toBe(true);
  });
});
