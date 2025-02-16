module.exports = {
  rootDir: "../",
  roots: ["./tests/integration"],
  transform: {
    "^.+\\.(t|j)sx?$": "@swc/jest",
  },
  testTimeout: 600000,
  testEnvironment: "node",
  setupFilesAfterEnv: ["./tests/integration/setup.ts"],
  testPathIgnorePatterns: [
    "./tests/integration/controllers/password/forgot-password.test.ts", // Ignore a specific file
  ],
};
