/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['<rootDir>/tests/**/*.spec.(js|jsx|ts|tsx)'],
  collectCoverageFrom: ['<rootDir>/src/**/*.(js|jsx|ts|tsx)'],
};