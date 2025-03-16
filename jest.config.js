/** @type {import('ts-jest').JestConfigWithTsJest} */
export const preset = 'ts-jest';
export const testEnvironment = 'node';
export const testMatch = ['**/test/**/*.test.ts'];
export const moduleFileExtensions = ['ts', 'js'];
export const transform = {
    '^.+\\.ts$': 'ts-jest', // Transform TypeScript files using ts-jest
};
export const collectCoverage = true;
export const collectCoverageFrom = ['src/**/*.ts'];
export const coverageDirectory = 'coverage';
  