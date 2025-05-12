module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["**/*.test.ts"],
  setupFilesAfterEnv: ["<rootDir>/src/setupTests.ts"],
  moduleNameMapper: {
    "@database/(.*)": "<rootDir>/src/database/$1"
  },
  testTimeout: 30000,
  detectOpenHandles: true,
  forceExit: true
};