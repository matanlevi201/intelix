module.exports = {
  rootDir: "../",
  roots: ["./tests/unit"],
  transform: { "^.+\\.(t|j)sx?$": "@swc/jest" },
  testTimeout: 600000,
  testEnvironment: "node",
  setupFilesAfterEnv: ["./tests/unit/setup.ts"],
};
