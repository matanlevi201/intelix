import request from "supertest";
import { IEmailRepository, IEmailService, IUserRepository, TYPES } from "../../../../src/types";
import { container } from "../../../../inversify.config";
import { app } from "../../../../src/app";

const BASE_URL = "/password";

describe(`POST ${BASE_URL}/reset`, () => {
  it("returns 404 when user not found", async () => {
    await request(app).post(`${BASE_URL}/reset`).send({ email: "test@test.com" }).expect(404);
  });

  it("return 502 when email failed to send", async () => {
    const prev = process.env.COURIER_AUTH_TOKEN;
    process.env.COURIER_AUTH_TOKEN = "";
    try {
      await container.get<IEmailService>(TYPES.IEmailService).init();
    } catch (error) {
      // Expected error: failed email service on purpose
    }
    const userRepository = container.get<IUserRepository>(TYPES.IUserRepository);
    const user = await userRepository.create({
      email: "test@test.com",
      password: "123456789",
    });
    await request(app)
      .post(`${BASE_URL}/reset`)
      .set(
        "Authorization",
        global.signin({
          id: user.id,
          email: user.email,
          is2FAEnabled: false,
          is2FAVerified: false,
          isOauth2User: false,
        })
      )
      .send({ email: user.email })
      .expect(502);
    process.env.COURIER_AUTH_TOKEN = prev;
  });

  it("return 201 when reset email was sent to user", async () => {
    const emailService = container.get<IEmailService>(TYPES.IEmailService);
    await emailService.init();
    const userRepository = container.get<IUserRepository>(TYPES.IUserRepository);
    const emailRepository = container.get<IEmailRepository>(TYPES.IEmailRepository);
    const userPayload = {
      email: "matan.levi.404@gmail.com",
      password: "123456789",
    };
    const user = await userRepository.create(userPayload);
    const response = await request(app)
      .post(`${BASE_URL}/reset`)
      .set(
        "Authorization",
        global.signin({
          id: user.id,
          email: user.email,
          is2FAEnabled: false,
          is2FAVerified: false,
          isOauth2User: false,
        })
      )
      .send({ email: user.email })
      .expect(201);

    const createdEmail = await emailRepository.findOne({
      id: response.body.mailId,
    });

    expect(createdEmail).toBeDefined();

    const mail = await emailService.getEmailById(createdEmail.mailId!);
    expect(mail).toBeDefined();
  });
});
