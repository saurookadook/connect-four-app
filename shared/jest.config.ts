export default {
  collectCoverageFrom: ['**/*.(t|j)s'],
  coverageDirectory: './coverage',
  // coveragePathIgnorePatterns: ['/dist/', '/node_modules/', '**/*.d.ts'],
  detectOpenHandles: true,
  forceExit: true,
  globalSetup: '<rootDir>/jest-global-setup.ts',
  moduleFileExtensions: ['js', 'json', 'ts'],
  moduleNameMapper: {
    '@/(.*)': '<rootDir>/src/$1',
  },
  modulePathIgnorePatterns: ['<rootDir>/dist/'],
  // preset: "ts-jest",
  // preset: '@shelf/jest-mongodb',
  rootDir: '.',
  setupFilesAfterEnv: ['./jest-setup.ts'],
  testEnvironment: 'node',
  testPathIgnorePatterns: [
    '/node_modules/', // force formatting
    '/dist/',
    '.+\\.d.ts',
  ],
  testRegex: '.*\\.\\S*test\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': [
      'ts-jest',
      {
        tsconfig: './tsconfig.test.json',
      },
    ],
  },
  verbose: true,
};
