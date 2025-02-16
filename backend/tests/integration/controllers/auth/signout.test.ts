import request from "supertest";
import { app } from "../../../../src/app";
import { container } from "../../../../inversify.config";
import { IBlacklistRepository, TYPES } from "../../../../src/types";

const BASE_URL = "/auth";

describe(`DELETE ${BASE_URL}/sessions`, () => {
  it("returns 205 when user signed out", async () => {
    const blacklistRepository = container.get<IBlacklistRepository>(TYPES.IBlacklistRepository);

    const payload = { email: "test@test.com", password: "Aa@@123456" };

    const signupResponse = await request(app).post(`${BASE_URL}/users`).send(payload).expect(200);
    const signupCookies = signupResponse.get("Set-Cookie") ?? [];
    const signupRefreshTokenCookie = signupCookies.find((cookie) => cookie.startsWith("refreshToken="));
    const refreshToken = signupRefreshTokenCookie?.match(/refreshToken=([^;]+)/)?.[1];

    const response = await request(app)
      .delete(`${BASE_URL}/sessions`)
      .set("Cookie", signupRefreshTokenCookie ?? "")
      .send({})
      .expect(205);
    const cookies = response.get("Set-Cookie") ?? [];
    const refreshTokenCookie = cookies.find((cookie) => cookie.startsWith("refreshToken="));

    const blacklisted = await blacklistRepository.findOne({ token: refreshToken });

    expect(blacklisted).toBeDefined();
    expect(blacklisted.token).toBe(refreshToken);
    expect(refreshTokenCookie).toEqual("refreshToken=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT");
  });
});
