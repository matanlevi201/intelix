import request from "supertest";
import { IUserRepository, TYPES } from "../../../../src/types";
import { container } from "../../../../inversify.config";
import { CurrentUser } from "@intelix/common";
import { app } from "../../../../src/app";
import jwt from "jsonwebtoken";

const BASE_URL = "/auth";

describe(`POST ${BASE_URL}/users`, () => {
  it("returns 406 when password is invalid", async () => {
    await request(app).post(`${BASE_URL}/users`).send({ email: "test@test.com" }).expect(406);
    await request(app).post(`${BASE_URL}/users`).send({ email: "test@test.com", password: "" }).expect(406);
    await request(app).post(`${BASE_URL}/users`).send({ email: "test@test.com", password: "123" }).expect(406);
    await request(app).post(`${BASE_URL}/users`).send({ email: "test@test.com", password: 123 }).expect(406);
    await request(app).post(`${BASE_URL}/users`).send({ email: "test@test.com", password: {} }).expect(406);
    await request(app).post(`${BASE_URL}/users`).send({ email: "test@test.com", password: [] }).expect(406);
  });

  it("returns 406 when email is invalid", async () => {
    await request(app).post(`${BASE_URL}/users`).send({ password: "Aa@@123456" }).expect(406);
    await request(app).post(`${BASE_URL}/users`).send({ email: "", password: "Aa@@123456" }).expect(406);
    await request(app).post(`${BASE_URL}/users`).send({ email: 123, password: "Aa@@123456" }).expect(406);
    await request(app).post(`${BASE_URL}/users`).send({ email: [], password: "Aa@@123456" }).expect(406);
    await request(app).post(`${BASE_URL}/users`).send({ email: {}, password: "Aa@@123456" }).expect(406);
    await request(app).post(`${BASE_URL}/users`).send({ email: "testtest.com", password: "Aa@@123456" }).expect(406);
  });

  it("returns 400 when email already in use", async () => {
    const payload = { email: "test@test.com", password: "Aa@@123456" };
    await request(app).post(`${BASE_URL}/users`).send(payload).expect(200);
    await request(app).post(`${BASE_URL}/users`).send(payload).expect(400);
  });

  it("returns 200 when user signed up", async () => {
    const userRepository = container.get<IUserRepository>(TYPES.IUserRepository);
    const payload = { email: "test@test.com", password: "Aa@@123456" };
    const response = await request(app).post(`${BASE_URL}/users`).send(payload).expect(200);
    const cookies = response.get("Set-Cookie") ?? [];
    const refreshTokenCookie = cookies.find((cookie) => cookie.startsWith("refreshToken="));
    const createdUser = await userRepository.findOne({ email: payload.email });

    expect(createdUser.email).toBe(payload.email);
    expect(refreshTokenCookie).toBeDefined();

    expect(refreshTokenCookie).toContain("HttpOnly");
    const { accessToken } = response.body;

    expect(accessToken).toBeDefined();

    const accessTokenPayload = jwt.verify(accessToken, process.env.ACCESS_JWT_KEY as string) as CurrentUser;

    expect(createdUser.email).toBe(accessTokenPayload.email);
    expect(accessTokenPayload.is2FAEnabled).toBe(false);
    expect(accessTokenPayload.is2FAVerified).toBe(false);
  });
});
