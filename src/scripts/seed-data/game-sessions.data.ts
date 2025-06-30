import { type UUID } from 'node:crypto';

import { GameSessionStatus } from '@/constants';
import { playersSeedData } from './players.data';

export type GameSessionSeed = {
  playerOneID: UUID;
  playerTwoID: UUID;
  moves: any[];
  status: GameSessionStatus;
};

const playerCombinations = [
  [playersSeedData[0].playerID, playersSeedData[1].playerID],
  [playersSeedData[0].playerID, playersSeedData[2].playerID],
  [playersSeedData[1].playerID, playersSeedData[0].playerID],
  [playersSeedData[1].playerID, playersSeedData[2].playerID],
  [playersSeedData[2].playerID, playersSeedData[0].playerID],
  [playersSeedData[2].playerID, playersSeedData[1].playerID],
];

export const unstartedGameSessions: GameSessionSeed[] = playerCombinations.map(
  ([playerOneID, playerTwoID]) => {
    return {
      playerOneID,
      playerTwoID,
      moves: [],
      status: GameSessionStatus.ACTIVE,
    };
  },
);

export const allGameSessionsSeedData: GameSessionSeed[] = [
  ...unstartedGameSessions,
];
