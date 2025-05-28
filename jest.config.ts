export default {
  collectCoverageFrom: ['**/*.(t|j)s'],
  coverageDirectory: '../coverage',
  // coveragePathIgnorePatterns: ['/dist/', '/node_modules/', '**/*.d.ts'],
  moduleFileExtensions: ['js', 'json', 'ts'],
  moduleNameMapper: {
    '@/(.*)': '<rootDir>/$1',
    '@constants/(.*)': '<rootDir>/constants/$1',
    '@game-engine/(.*)': '<rootDir>/game-engine/$1',
  },
  // preset: "ts-jest",
  // preset: '@shelf/jest-mongodb',
  rootDir: 'src',
  setupFilesAfterEnv: ['../jest-setup.ts'],
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
};
