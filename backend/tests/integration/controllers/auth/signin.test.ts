import request from "supertest";
import { IUserRepository, TYPES } from "../../../../src/types";
import { container } from "../../../../inversify.config";
import { Password } from "../../../../src/utils";
import { CurrentUser } from "@intelix/common";
import { app } from "../../../../src/app";
import jwt from "jsonwebtoken";

const BASE_URL = "/auth";

describe(`POST ${BASE_URL}/sessions`, () => {
  it("returns 406 when password is invalid", async () => {
    await request(app).post(`${BASE_URL}/sessions`).send({ email: "test@test.com" }).expect(406);
    await request(app).post(`${BASE_URL}/sessions`).send({ email: "test@test.com", password: "" }).expect(406);
    await request(app).post(`${BASE_URL}/sessions`).send({ email: "test@test.com", password: "123" }).expect(406);
    await request(app).post(`${BASE_URL}/sessions`).send({ email: "test@test.com", password: 123 }).expect(406);
    await request(app).post(`${BASE_URL}/sessions`).send({ email: "test@test.com", password: {} }).expect(406);
    await request(app).post(`${BASE_URL}/sessions`).send({ email: "test@test.com", password: [] }).expect(406);
  });

  it("returns 406 when email is invalid", async () => {
    await request(app).post(`${BASE_URL}/sessions`).send({ password: "Aa@@123456" }).expect(406);
    await request(app).post(`${BASE_URL}/sessions`).send({ email: "", password: "Aa@@123456" }).expect(406);
    await request(app).post(`${BASE_URL}/sessions`).send({ email: 123, password: "Aa@@123456" }).expect(406);
    await request(app).post(`${BASE_URL}/sessions`).send({ email: [], password: "Aa@@123456" }).expect(406);
    await request(app).post(`${BASE_URL}/sessions`).send({ email: {}, password: "Aa@@123456" }).expect(406);
    await request(app).post(`${BASE_URL}/sessions`).send({ email: "testtest.com", password: "Aa@@123456" }).expect(406);
  });

  it("returns 400 when credentials are invalid", async () => {
    const userRepository = container.get<IUserRepository>(TYPES.IUserRepository);
    const payload = { email: "test@test.com", password: "Aa@@123456" };
    await userRepository.create({ email: payload.email, password: await Password.toHash(payload.password) });
    await request(app)
      .post(`${BASE_URL}/sessions`)
      .send({ ...payload, email: "invalid@email.com" })
      .expect(400);
    await request(app)
      .post(`${BASE_URL}/sessions`)
      .send({ ...payload, password: "invalid_password" })
      .expect(400);
  });

  it("returns 200 when user signed in with 2fa is disabled", async () => {
    const userRepository = container.get<IUserRepository>(TYPES.IUserRepository);
    const payload = { email: "test@test.com", password: "Aa@@123456" };
    await userRepository.create({ email: payload.email, password: await Password.toHash(payload.password) });
    const response = await request(app).post(`${BASE_URL}/sessions`).send(payload).expect(200);
    const cookies = response.get("Set-Cookie") ?? [];
    const refreshTokenCookie = cookies.find((cookie) => cookie.startsWith("refreshToken="));

    expect(refreshTokenCookie).toBeDefined();
    expect(refreshTokenCookie).toContain("HttpOnly");

    const { accessToken } = response.body;

    expect(accessToken).toBeDefined();

    const accessTokenPayload = jwt.verify(accessToken, process.env.ACCESS_JWT_KEY as string) as CurrentUser;
    expect(accessTokenPayload.is2FAEnabled).toBe(false);
    expect(accessTokenPayload.is2FAVerified).toBe(false);
  });

  it("returns 200 when user signed in with 2fa is enabled", async () => {
    const userRepository = container.get<IUserRepository>(TYPES.IUserRepository);
    const payload = { email: "test@test.com", password: "Aa@@123456" };
    const user = await userRepository.create({ email: payload.email, password: await Password.toHash(payload.password) });
    await userRepository.update(user.id, { is2FAEnabled: true });
    const response = await request(app).post(`${BASE_URL}/sessions`).send(payload).expect(200);
    const cookies = response.get("Set-Cookie");
    expect(cookies).not.toBeDefined();

    const { accessToken } = response.body;

    expect(accessToken).toBeDefined();
    const signedInUser = jwt.verify(accessToken, process.env.TEMP_2FA_JWT_KEY as string) as CurrentUser;
    expect(signedInUser.is2FAEnabled).toBe(true);
    expect(signedInUser.is2FAVerified).toBe(false);
  });
});
