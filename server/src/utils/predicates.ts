export const isProdEnv = (env: unknown) =>
  typeof env === 'string' && env === 'prod';

export const isTestEnv = (env: unknown) =>
  typeof env === 'string' && env === 'test';
