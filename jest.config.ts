export default {
  collectCoverageFrom: ['**/*.(t|j)s'],
  coverageDirectory: './coverage',
  // coveragePathIgnorePatterns: ['/dist/', '/node_modules/', '**/*.d.ts'],
  detectOpenHandles: true,
  forceExit: true,
  moduleFileExtensions: ['js', 'json', 'ts'],
  moduleNameMapper: {
    '@/(.*)': '<rootDir>/src/$1',
    '@constants/(.*)': '<rootDir>/src/constants/$1',
    '@game-engine/(.*)': '<rootDir>/src/game-engine/$1',
  },
  // preset: "ts-jest",
  // preset: '@shelf/jest-mongodb',
  rootDir: '.',
  setupFilesAfterEnv: ['./jest-setup.ts'],
  testEnvironment: 'node',
  // testPathIgnorePatterns: [
  //     ".+\.d.ts",
  // ],
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
