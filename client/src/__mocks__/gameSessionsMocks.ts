import { randomUUID, type UUID } from 'crypto';

import { GameSessionStatus, type PlayerID } from '@connect-four-app/shared';
import { mockPlayers } from './playerMocks';

export type GameSessionMock = {
  /** @todo This should be a MongoDB `ObjectId` */
  id: string;
  moves: Record<string, unknown>[];
  playerOneID: PlayerID;
  playerTwoID: PlayerID;
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

export function createMockGameSession({
  id,
  ...args
}: { id?: string } & Partial<GameSessionMock>) {
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
    /** @todo This should be a MongoDB `ObjectId` */
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
      id: randomUUID(), // TODO: should be Mongo `ObjectId`
      moves: [],
      playerOneID,
      playerTwoID,
      status: GameSessionStatus.ACTIVE,
    };
  },
);

export const allGameSessionsMock: GameSessionMock[] = [...unstartedGameSessionsMock];
