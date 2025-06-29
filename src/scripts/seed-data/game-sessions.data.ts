import { GameSessionStatus } from '@/constants';

import { playersSeedData } from './players.data';

const playerCombinations = [
  [playersSeedData[0].playerID, playersSeedData[1].playerID],
  [playersSeedData[0].playerID, playersSeedData[2].playerID],
  [playersSeedData[1].playerID, playersSeedData[0].playerID],
  [playersSeedData[1].playerID, playersSeedData[2].playerID],
  [playersSeedData[2].playerID, playersSeedData[0].playerID],
  [playersSeedData[2].playerID, playersSeedData[1].playerID],
];

export const unstartedGameSessions = playerCombinations.map(
  ([playerOneID, playerTwoID]) => {
    return {
      playerOneID,
      playerTwoID,
      moves: [],
      status: GameSessionStatus.ACTIVE,
    };
  },
);

export const allSeedGameSessionsData = [...unstartedGameSessions];
