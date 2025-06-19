import { randomUUID } from 'node:crypto';

import { mockNow } from './commonMocks';

export const mockFirstPlayerID = randomUUID();
export const mockSecondPlayerID = randomUUID();
export const mockThirdPlayerID = randomUUID();

export const mockFirstPlayer = {
  username: 'player_uno',
  unhashedPassword: 'superdupergoodpassword',
  createdAt: mockNow,
  updatedAt: mockNow,
};
export const mockSecondPlayer = {
  username: 'player_dos',
  unhashedPassword: 'superdupergoodpassword',
  createdAt: mockNow,
  updatedAt: mockNow,
};
export const mockThirdPlayer = {
  username: 'player_tres',
  unhashedPassword: 'superdupergoodpassword',
  createdAt: mockNow,
  updatedAt: mockNow,
};
