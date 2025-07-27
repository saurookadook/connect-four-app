import { randomUUID } from 'crypto';

import {
  GameSessionStatus,
  type Nullable,
  type PlayerID,
  type PlayerMove,
} from '@connect-four-app/shared';
import { mockPlayers } from './playerMocks';

export type GameSessionMock = {
  /** @todo This should be a MongoDB `ObjectId` */
  id: string;
  moves: PlayerMove[];
  playerOneID: PlayerID;
  playerTwoID: PlayerID;
  status: GameSessionStatus;
  winner: Nullable<PlayerID>;
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
      winner: null,
    };
  },
);

export const allGameSessionsMock: GameSessionMock[] = [...unstartedGameSessionsMock];

export function findGameSessionMock({
  gameSessionID,
  playerID,
}: {
  gameSessionID: string;
  playerID: PlayerID;
}) {
  return allGameSessionsMock.find((gameSession) => {
    return (
      gameSession.id === gameSessionID &&
      (gameSession.playerOneID === playerID || gameSession.playerTwoID === playerID)
    );
  });
}

export function findGameSessionMockForPlayers({
  gameSessionID,
  playerOneID,
  playerTwoID,
}: {
  gameSessionID?: string;
  playerOneID: PlayerID;
  playerTwoID: PlayerID;
}) {
  return allGameSessionsMock.find((gameSession) => {
    const gameSessionHasBothPlayerIDs =
      gameSession.playerOneID === playerOneID &&
      gameSession.playerTwoID === playerTwoID;

    return gameSessionID == null
      ? gameSessionHasBothPlayerIDs
      : gameSession.id === gameSessionID && gameSessionHasBothPlayerIDs;
  });
}
