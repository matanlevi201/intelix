import { googleCallback } from "../../../../src/controllers/auth.controllers";
import { mockUserRepository } from "../../__mocks__/repositories";
import { IUserRepository, TYPES } from "../../../../src/types";
import { container } from "../../../../inversify.config";

const doneMock = jest.fn();

describe("AUTH / googleCallback Controller", () => {
  container.bind<IUserRepository>(TYPES.IUserRepository).toConstantValue(mockUserRepository);

  it("should process an oauth2 user signup", async () => {
    const profile = { id: 1, emails: [{ value: "test@example.com" }] } as any;
    mockUserRepository.findOne.mockResolvedValue(null);
    mockUserRepository.create.mockResolvedValue({ id: 123, email: profile.emails?.[0].value });

    await googleCallback("accessToken", "refreshToken", profile, doneMock);

    expect(mockUserRepository.findOne).toHaveBeenCalledWith({ email: profile.emails?.[0].value });
    expect(mockUserRepository.create).toHaveBeenCalledWith({ email: profile.emails?.[0].value, googleId: profile.id });
    expect(doneMock).toHaveBeenCalledWith(null, { id: 123, email: profile.emails?.[0].value });
  });

  it("should process an oauth2 user signin", async () => {
    const profile = { id: 1, emails: [{ value: "test@example.com" }] } as any;
    mockUserRepository.findOne.mockResolvedValue({ id: 123, email: profile.emails?.[0].value });

    await googleCallback("accessToken", "refreshToken", profile, doneMock);

    expect(mockUserRepository.findOne).toHaveBeenCalledWith({ email: profile.emails?.[0].value });
    expect(mockUserRepository.create).not.toHaveBeenCalled();
    expect(doneMock).toHaveBeenCalledWith(null, { id: 123, email: profile.emails?.[0].value });
  });

  it("should catch unexpected error and call done with error", async () => {
    const profile = { id: 1, emails: [{ value: "test@example.com" }] } as any;
    mockUserRepository.findOne.mockResolvedValue(null);
    const unexpectedError = new Error("Unexpected");

    jest.spyOn(mockUserRepository, "create").mockImplementation(() => {
      throw unexpectedError;
    });

    await googleCallback("accessToken", "refreshToken", profile, doneMock);

    expect(mockUserRepository.findOne).toHaveBeenCalledWith({ email: profile.emails?.[0].value });
    expect(mockUserRepository.create).toHaveBeenCalledWith({ email: profile.emails?.[0].value, googleId: profile.id });
    expect(doneMock).toHaveBeenCalledWith(unexpectedError);
  });
});
