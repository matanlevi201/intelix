import request from "supertest";
import { IUserRepository, TYPES } from "../../../../src/types";
import { container } from "../../../../inversify.config";
import { Password } from "../../../../src/utils";
import { app } from "../../../../src/app";

const BASE_URL = "/2fa";

describe(`GET ${BASE_URL}`, () => {
  it("returns 401 when user is not signed in", async () => {
    await request(app).get(`${BASE_URL}`).send().expect(401);
  });

  it("returns 403 when user signed up with social account", async () => {
    await request(app)
      .get(`${BASE_URL}`)
      .set("Authorization", global.signin({ id: 1, email: "test@test.com", is2FAEnabled: false, is2FAVerified: false, isOauth2User: true }))
      .send()
      .expect(403);
  });

  it("returns 400 when failed to update 2fa secret on user", async () => {
    await request(app).get(`${BASE_URL}`).set("Authorization", global.signin()).send().expect(400);
  });

  it("returns 200 when update 2fa secret on user", async () => {
    const userRepository = container.get<IUserRepository>(TYPES.IUserRepository);
    const user = await userRepository.create({ email: "test@test.com", password: await Password.toHash("Aa@@123456") });

    expect(user.twoFactorSecret).toBeFalsy();

    const response = await request(app)
      .get(`${BASE_URL}`)
      .set(
        "Authorization",
        global.signin({ id: user.id, email: user.email, is2FAEnabled: user.is2FAEnabled, is2FAVerified: false, isOauth2User: false })
      )
      .send()
      .expect(200);
    const updatedUser = await userRepository.findOne({ id: user.id });

    expect(updatedUser.twoFactorSecret).toBeTruthy();
    expect(updatedUser.is2FAEnabled).toBe(false);
    expect(response.body.secret).toBe(updatedUser.twoFactorSecret);
    expect(response.body.qr).toBeDefined;
  });
});
