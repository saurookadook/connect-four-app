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

export function createMockGameSession({ id, ...args }: { id?: UUID } & Partial<GameSessionMock>) {
  const { playerOneID, playerTwoID } = (function () {
    if (args.playerOneID == null && args.playerTwoID == null) {
      const [firstPlayerCombination] = playerCombinations[0];
      return {
        playerOneID: firstPlayerCombination[0],
        playerTwoID: firstPlayerCombination[1],
      };
    } else {
      return {
        playerOneID: args.playerOneID,
        playerTwoID: args.playerTwoID,
      };
    }
  })();

  return {
    // TODO: this should be a MongoDB `ObjectId`
    id: id ?? randomUUID(),
    moves: [],
    playerOneID,
    playerTwoID,
    status: GameSessionStatus.ACTIVE,
    ...args,
  };
}

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
