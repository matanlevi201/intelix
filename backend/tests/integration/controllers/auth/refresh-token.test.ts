import request from "supertest";
import { IBlacklistRepository, IUserRepository, TYPES } from "../../../../src/types";
import { container } from "../../../../inversify.config";
import { Password, Tokens } from "../../../../src/utils";
import { CurrentUser } from "@intelix/common";
import { app } from "../../../../src/app";
import jwt from "jsonwebtoken";

const BASE_URL = "/auth";

describe(`GET ${BASE_URL}/sessions`, () => {
  it("returns 403 when refresh token is blacklisted", async () => {
    const blacklistedToken = "blacklisted_token";
    const blacklistRepository = container.get<IBlacklistRepository>(TYPES.IBlacklistRepository);
    await blacklistRepository.create({ token: blacklistedToken });
    const invalidCookie = `refreshToken=${blacklistedToken}; Path=/; Expires=${new Date(0).toUTCString()}`;
    const response = await request(app).get(`${BASE_URL}/sessions`).set("Cookie", invalidCookie).send().expect(403);
  });

  it("returns 401 when failed to verified refresh token", async () => {
    const invalidCookie = `refreshToken=INVALID; Path=/; Expires=${new Date(0).toUTCString()}`;
    const response = await request(app).get(`${BASE_URL}/sessions`).set("Cookie", invalidCookie).send().expect(401);
    const cookies = response.get("Set-Cookie") ?? [];
    const refreshTokenCookie = cookies.find((cookie) => cookie.startsWith("refreshToken="));
    expect(refreshTokenCookie).toEqual("refreshToken=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT");
  });

  it("returns 404 when user not found", async () => {
    const expiresInOneMinute = new Date(Date.now() + 1 * 60 * 1000).toUTCString();
    const payload = { id: 1, email: "test@test.com", is2FAEnabled: false, is2FAVerified: false, isOauth2User: false };
    const { refreshToken } = Tokens.generateRefreshToken(payload);
    const cookie = `refreshToken=${refreshToken}; Path=/; Expires=${expiresInOneMinute}`;
    await request(app).get(`${BASE_URL}/sessions`).set("Cookie", cookie).send().expect(404);
  });

  it("returns 200 when token has refreshed", async () => {
    const userRepository = container.get<IUserRepository>(TYPES.IUserRepository);
    const expiresInOneMinute = new Date(Date.now() + 1 * 60 * 1000).toUTCString();
    const user = await userRepository.create({ email: "test@test.com", password: await Password.toHash("Aa@@123456") });
    const payload = { id: user.id, email: user.email, is2FAEnabled: false, is2FAVerified: false, isOauth2User: false };
    const { refreshToken } = Tokens.generateRefreshToken(payload);
    const cookie = `refreshToken=${refreshToken}; Path=/; Expires=${expiresInOneMinute}`;
    const response = await request(app).get(`${BASE_URL}/sessions`).set("Cookie", cookie).send().expect(200);

    const { accessToken } = response.body;

    expect(accessToken).toBeDefined();

    const accessTokenPayload = jwt.verify(accessToken, process.env.ACCESS_JWT_KEY as string) as CurrentUser;
    expect(accessTokenPayload.is2FAEnabled).toBe(payload.is2FAEnabled);
    expect(accessTokenPayload.is2FAVerified).toBe(payload.is2FAVerified);
  });
});
