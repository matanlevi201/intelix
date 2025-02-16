import { Password } from "../../../src/utils";

describe("UTILITIES / Password", () => {
  it("should hash a password correctly", async () => {
    const password = "securePassword123";
    const hashedPassword = await Password.toHash(password);

    expect(hashedPassword).toBeDefined();
    expect(hashedPassword.split(".")).toHaveLength(2); // Ensure salt is included
  });

  it("should match a password with its hash", async () => {
    const password = "securePassword123";
    const hashedPassword = await Password.toHash(password);

    const isMatch = await Password.compare(hashedPassword, password);
    expect(isMatch).toBe(true);
  });

  it("should fail for incorrect passwords", async () => {
    const password = "securePassword123";
    const hashedPassword = await Password.toHash(password);

    const isMatch = await Password.compare(hashedPassword, "wrongPassword");
    expect(isMatch).toBe(false);
  });
});
