import { randomUUID, type UUID } from 'node:crypto';

export const mockFirstPlayerID = randomUUID();
export const mockSecondPlayerID = randomUUID();
export const mockThirdPlayerID = randomUUID();

type PlayerAuthDetails = {
  playerID: UUID;
  username: string;
  password: string;
};

export const mockFirstPlayer = {
  playerID: mockFirstPlayerID,
  username: 'player_uno',
  unhashedPassword: 'superdupergoodpassword',
};
export const mockSecondPlayer = {
  playerID: mockSecondPlayerID,
  username: 'player_dos',
  unhashedPassword: 'boopy99!',
};
export const mockThirdPlayer = {
  playerID: mockThirdPlayerID,
  username: 'player_tres',
  unhashedPassword: 'mO0k1eb0OKI3',
};

export const mockPlayers = [mockFirstPlayer, mockSecondPlayer, mockThirdPlayer].reduce(
  (acc, player) => {
    const { unhashedPassword, ...rest } = player;
    acc.push({
      ...rest,
      password: unhashedPassword,
    });
    return acc;
  },
  [] as PlayerAuthDetails[],
);
