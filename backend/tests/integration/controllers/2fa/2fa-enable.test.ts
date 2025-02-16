import { IUserRepository, TYPES } from "../../../../src/types";
import { container } from "../../../../inversify.config";
import { Password } from "../../../../src/utils";
import { CurrentUser } from "@intelix/common";
import { app } from "../../../../src/app";
import request from "supertest";
import speakeasy from "speakeasy";
import jwt from "jsonwebtoken";

const BASE_URL = "/2fa";

describe(`POST ${BASE_URL}`, () => {
  it("returns 401 when user is not signed in", async () => {
    await request(app).post(`${BASE_URL}`).send({ email: "test@test.com" }).expect(401);
  });

  it("returns 403 when user signed up with social account", async () => {
    await request(app)
      .post(`${BASE_URL}`)
      .set("Authorization", global.signin({ id: 1, email: "test@test.com", is2FAEnabled: false, is2FAVerified: false, isOauth2User: true }))
      .send()
      .expect(403);
  });

  it("returns 406 when otp token is invalid", async () => {
    await request(app).post(`${BASE_URL}`).set("Authorization", global.signin()).send().expect(406);
    await request(app).post(`${BASE_URL}`).set("Authorization", global.signin()).send({ token: 123 }).expect(406);
    await request(app).post(`${BASE_URL}`).set("Authorization", global.signin()).send({ token: [] }).expect(406);
    await request(app).post(`${BASE_URL}`).set("Authorization", global.signin()).send({ token: {} }).expect(406);
    await request(app).post(`${BASE_URL}`).set("Authorization", global.signin()).send({ token: null }).expect(406);
  });

  it("returns 404 when user not found", async () => {
    await request(app).post(`${BASE_URL}`).set("Authorization", global.signin()).send({ token: "123456" }).expect(404);
  });

  it("returns 401 when otp token is not verified", async () => {
    const userRepository = container.get<IUserRepository>(TYPES.IUserRepository);
    const createdUser = await userRepository.create({ email: "test@test.com", password: await Password.toHash("Aa@@123456") });
    const secret = speakeasy.generateSecret();
    const user = await userRepository.update(createdUser.id, { twoFactorSecret: secret.base32 });

    expect(user.twoFactorSecret).toBeTruthy();
    expect(user.is2FAEnabled).toBe(false);

    await request(app)
      .post(`${BASE_URL}`)
      .set("Authorization", global.signin({ id: user.id, email: user.email, is2FAEnabled: user.is2FAEnabled, is2FAVerified: false, isOauth2User: false }))
      .send({ token: "123456" })
      .expect(403);

    const updatedUser = await userRepository.findOne({ id: user.id });

    expect(updatedUser.is2FAEnabled).toBe(false);
    expect(updatedUser.twoFactorSecret).toBe(null);
  });

  it("returns 200 when 2fa enabled", async () => {
    const userRepository = container.get<IUserRepository>(TYPES.IUserRepository);
    const createdUser = await userRepository.create({ email: "test@test.com", password: await Password.toHash("123456789") });
    const secret = speakeasy.generateSecret();
    const user = await userRepository.update(createdUser.id, { twoFactorSecret: secret.base32 });

    expect(user.twoFactorSecret).toBe(secret.base32);
    expect(user.is2FAEnabled).toBe(false);

    const token = speakeasy.totp({
      secret: user.twoFactorSecret ?? "",
      encoding: "base32",
    });

    const response = await request(app)
      .post(`${BASE_URL}`)
      .set("Authorization", global.signin({ id: user.id, email: user.email, is2FAEnabled: user.is2FAEnabled, is2FAVerified: false, isOauth2User: false }))
      .send({ token })
      .expect(200);

    const updatedUser = await userRepository.findOne({ id: user.id });

    expect(updatedUser.is2FAEnabled).toBe(true);

    const cookies = response.get("Set-Cookie") ?? [];
    const refreshTokenCookie = cookies.find((cookie) => cookie.startsWith("refreshToken="));

    expect(refreshTokenCookie).toBeDefined();
    expect(refreshTokenCookie).toContain("HttpOnly");

    const { accessToken } = response.body;

    expect(accessToken).toBeDefined();

    const accessTokenPayload = jwt.verify(accessToken, process.env.ACCESS_JWT_KEY as string) as CurrentUser;

    expect(accessTokenPayload.is2FAEnabled).toBe(true);
    expect(accessTokenPayload.is2FAVerified).toBe(true);
  });
});
