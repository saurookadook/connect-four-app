import { randomUUID, type UUID } from 'crypto';

import { GameSessionStatus } from '@/types/main.d';
import { mockPlayers } from './playerMocks';

type GameSessionMock = {
  moves: Record<string, unknown>[];
  playerOneID: UUID;
  playerTwoID: UUID;
  status: GameSessionStatus;
};

const playerCombinations = [
  [mockPlayers[0].playerID, mockPlayers[1].playerID],
  [mockPlayers[0].playerID, mockPlayers[2].playerID],
  [mockPlayers[1].playerID, mockPlayers[0].playerID],
  [mockPlayers[1].playerID, mockPlayers[2].playerID],
  [mockPlayers[2].playerID, mockPlayers[0].playerID],
  [mockPlayers[2].playerID, mockPlayers[1].playerID],
];

export const unstartedGameSessionsMock: GameSessionMock[] = playerCombinations.map(
  ([playerOneID, playerTwoID]) => {
    return {
      id: randomUUID(),
      moves: [],
      playerOneID,
      playerTwoID,
      status: GameSessionStatus.ACTIVE,
    };
  },
);

export const allGameSessionsMock: GameSessionMock[] = [...unstartedGameSessionsMock];
