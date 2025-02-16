import request from "supertest";
import { IUserRepository, TYPES } from "../../../../src/types";
import { container } from "../../../../inversify.config";
import { Password } from "../../../../src/utils";
import { app } from "../../../../src/app";

const BASE_URL = "/password";

describe(`PUT ${BASE_URL}`, () => {
  it("returns 401 when user is not signed in", async () => {
    await request(app).put(`${BASE_URL}`).send({ currentPassword: "123456789", newPassword: "123456789" }).expect(401);
  });

  it("returns 403 when user signed up with social account", async () => {
    const userRepository = container.get<IUserRepository>(TYPES.IUserRepository);
    const user = await userRepository.create({ email: "test@test.com", googleId: "123456789" });
    await request(app)
      .put(`${BASE_URL}`)
      .set(
        "Authorization",
        global.signin({ id: user.id, email: user.email, is2FAEnabled: false, is2FAVerified: false, isOauth2User: true })
      )
      .send({ currentPassword: "123456789", newPassword: "123456789" })
      .expect(403);
  });

  it("returns 401 when user is not otp verified", async () => {
    const userRepository = container.get<IUserRepository>(TYPES.IUserRepository);
    const user = await userRepository.create({ email: "test@test.com", password: await Password.toHash("Aa@@123456") });
    await request(app)
      .put(`${BASE_URL}`)
      .set(
        "Authorization",
        global.signin({ id: user.id, email: user.email, is2FAEnabled: true, is2FAVerified: false, isOauth2User: false })
      )
      .send({ currentPassword: "123456789", newPassword: "123456789" })
      .expect(401);
  });

  it("returns 406 when request body is invalid", async () => {
    await request(app).put(`${BASE_URL}`).set("Authorization", global.signin()).send({ currentPassword: "123456789" }).expect(406);
    await request(app)
      .put(`${BASE_URL}`)
      .set("Authorization", global.signin())
      .send({ currentPassword: "123456789", newPassword: "" })
      .expect(406);
    await request(app)
      .put(`${BASE_URL}`)
      .set("Authorization", global.signin())
      .send({ currentPassword: "123456789", newPassword: "123" })
      .expect(406);
    await request(app)
      .put(`${BASE_URL}`)
      .set("Authorization", global.signin())
      .send({ currentPassword: "123456789", newPassword: 123 })
      .expect(406);
    await request(app)
      .put(`${BASE_URL}`)
      .set("Authorization", global.signin())
      .send({ currentPassword: "123456789", newPassword: {} })
      .expect(406);
    await request(app)
      .put(`${BASE_URL}`)
      .set("Authorization", global.signin())
      .send({ currentPassword: "123456789", newPassword: [] })
      .expect(406);

    await request(app).put(`${BASE_URL}`).set("Authorization", global.signin()).send({ newPassword: "123456789" }).expect(406);
    await request(app)
      .put(`${BASE_URL}`)
      .set("Authorization", global.signin())
      .send({ newPassword: "123456789", currentPassword: "" })
      .expect(406);
    await request(app)
      .put(`${BASE_URL}`)
      .set("Authorization", global.signin())
      .send({ newPassword: "123456789", currentPassword: "123" })
      .expect(406);
    await request(app)
      .put(`${BASE_URL}`)
      .set("Authorization", global.signin())
      .send({ newPassword: "123456789", currentPassword: 123 })
      .expect(406);
    await request(app)
      .put(`${BASE_URL}`)
      .set("Authorization", global.signin())
      .send({ newPassword: "123456789", currentPassword: {} })
      .expect(406);
    await request(app)
      .put(`${BASE_URL}`)
      .set("Authorization", global.signin())
      .send({ newPassword: "123456789", currentPassword: [] })
      .expect(406);
  });

  it("returns 404 when user not found", async () => {
    await request(app)
      .put(`${BASE_URL}`)
      .set("Authorization", global.signin())
      .send({ currentPassword: "123456789", newPassword: "123456789" })
      .expect(404);
  });

  it("returns 400 when current password is incorrect", async () => {
    const userRepository = container.get<IUserRepository>(TYPES.IUserRepository);
    const user = await userRepository.create({ email: "test@test.com", password: await Password.toHash("123456789") });
    await request(app)
      .put(`${BASE_URL}`)
      .set(
        "Authorization",
        global.signin({ id: user.id, email: user.email, is2FAEnabled: false, is2FAVerified: false, isOauth2User: false })
      )
      .send({ currentPassword: "987654321", newPassword: "123456789" })
      .expect(400);
  });

  it("returns 200 when password changed successfully", async () => {
    const userRepository = container.get<IUserRepository>(TYPES.IUserRepository);
    const payload = { currentPassword: "123456789", newPassword: "987654321" };
    const user = await userRepository.create({ email: "test@test.com", password: await Password.toHash(payload.currentPassword) });
    await request(app)
      .put(`${BASE_URL}`)
      .set(
        "Authorization",
        global.signin({ id: user.id, email: user.email, is2FAEnabled: false, is2FAVerified: false, isOauth2User: false })
      )
      .send(payload)
      .expect(200);

    const updatedUser = await userRepository.findOne({ id: user.id });

    const isNewPasswordMatching = await Password.compare(updatedUser.password!, payload.newPassword);
    expect(isNewPasswordMatching).toBe(true);
  });
});
