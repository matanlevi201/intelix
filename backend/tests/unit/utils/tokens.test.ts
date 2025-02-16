import { Tokens } from "../../../src/utils";
import jwt from "jsonwebtoken";

describe("UTILITIES / Tokens", () => {
  const userPayload = { id: 1, email: "test@test.com", is2FAEnabled: false, is2FAVerified: false, isOauth2User: false };

  it("should generate a refresh token", () => {
    jest.spyOn(jwt, "sign").mockImplementationOnce(() => "mockRefreshToken");

    const { refreshToken } = Tokens.generateRefreshToken(userPayload);

    expect(jwt.sign).toHaveBeenCalledWith(userPayload, process.env.REFRESH_JWT_KEY, { expiresIn: "7d" });
    expect(refreshToken).toBe("mockRefreshToken");
  });

  it("should generate a access token", () => {
    jest.spyOn(jwt, "sign").mockImplementationOnce(() => "mockAccessToken");

    const { accessToken } = Tokens.generateAccessToken(userPayload);

    expect(jwt.sign).toHaveBeenCalledWith(userPayload, process.env.ACCESS_JWT_KEY, { expiresIn: "1m" });
    expect(accessToken).toBe("mockAccessToken");
  });

  it("should generate a temp 2fa token", () => {
    jest.spyOn(jwt, "sign").mockImplementationOnce(() => "mockTemp2FAToken");

    const { temp2FAToken } = Tokens.generateTemp2FAToken(userPayload);

    expect(jwt.sign).toHaveBeenCalledWith({ ...userPayload, is2FAEnabled: true, is2FAVerified: false }, process.env.TEMP_2FA_JWT_KEY, {
      expiresIn: "1m",
    });
    expect(temp2FAToken).toBe("mockTemp2FAToken");
  });

  it("should generate a reset token", () => {
    jest.spyOn(jwt, "sign").mockImplementationOnce(() => "mockResetToken");

    const { resetToken } = Tokens.generateResetToken(userPayload.email);

    expect(jwt.sign).toHaveBeenCalledWith({ email: userPayload.email }, process.env.RESET_JWT_KEY, { expiresIn: "5m" });
    expect(resetToken).toBe("mockResetToken");
  });
});
