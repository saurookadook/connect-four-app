export const isProdEnv = (env: unknown) =>
  typeof env === 'string' && env === 'prod';
