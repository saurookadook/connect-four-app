import { GameSessionStatus } from '@/constants';

import { seedPlayersData } from './players.data';

const playerCombinations = [
  [seedPlayersData[0].playerID, seedPlayersData[1].playerID],
  [seedPlayersData[0].playerID, seedPlayersData[2].playerID],
  [seedPlayersData[1].playerID, seedPlayersData[0].playerID],
  [seedPlayersData[1].playerID, seedPlayersData[2].playerID],
  [seedPlayersData[2].playerID, seedPlayersData[0].playerID],
  [seedPlayersData[2].playerID, seedPlayersData[1].playerID],
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
