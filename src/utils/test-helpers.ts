export const createMockModel = <T>(model: T) => ({
  new: jest.fn().mockResolvedValue(model),
  constructor: jest.fn().mockResolvedValue(model),
  find: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  exec: jest.fn(),
});
