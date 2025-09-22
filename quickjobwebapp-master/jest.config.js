module.exports = {
  testEnvironment: 'node',
  setupFilesAfterEnv: ['./src/setupTests.js'],
  testMatch: ['**/__tests__/**/*.test.ts'],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
};