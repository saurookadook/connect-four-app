import { safeParseJSON, sharedLog, type PlayerID } from '@connect-four-app/shared';
import { startGame } from '@/store/actions';
import { REQUEST_PLAYERS_DATA, SET_PLAYERS_DATA } from '@/store';
import type { BaseAction, BoundThis, MatchmakingPlayersData } from '@/types/main';
import { safeFetch } from '@/utils';

const logger = sharedLog.getLogger('matchmakingActions');

export async function fetchPlayersData({
  dispatch,
  currentPlayerID,
}: BaseAction & { currentPlayerID: PlayerID }) {
  const fnName = fetchPlayersData.name;

  dispatch({ type: REQUEST_PLAYERS_DATA });

  const responseData = await safeFetch.call(
    { name: fnName },
    {
      requestPathname: `/api/players/all?currentPlayerID=${currentPlayerID}`,
      fetchOpts: {
        method: 'GET',
      },
    },
  );

  return setPlayersData({
    dispatch,
    playersData: responseData.playersData,
  });
}

export async function makeStartGameRequest({
  dispatch,
  playerOneID,
  playerTwoID,
}: BaseAction & {
  playerOneID: PlayerID;
  playerTwoID: PlayerID;
}) {
  const fnName = makeStartGameRequest.name;
  const fetchOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      credentials: 'include',
    },
    body: JSON.stringify({
      playerOneID,
      playerTwoID,
    }),
  };

  const responseData = await safeFetch.call(
    { name: fnName },
    {
      requestPathname: `/api/game-engine/start`,
      fetchOpts: fetchOptions,
    },
  );

  logger.setLevel('debug');
  logger.debug(`[${fnName}] responseData`, {
    responseData,
  });

  if (responseData.boardState == null || responseData.gameSession == null) {
    throw new Error(
      `[${makeStartGameRequest.name}] Received malformed response:\n${JSON.stringify(responseData, null, 4)}`,
    );
  }

  startGame({
    dispatch,
    // @ts-expect-error: TEMP
    gameSessionData: {
      gameSessionID: responseData.gameSession.id,
      boardCells: responseData.boardState.cells,
      moves: [],
      playerOneID: playerOneID,
      playerTwoID: playerTwoID,
    },
  });

  return {
    boardState: responseData.boardState,
    gameSession: responseData.gameSession,
  };
}

export function setPlayersData({
  dispatch, // force formatting
  playersData,
}: BaseAction & { playersData: MatchmakingPlayersData[] }) {
  return dispatch({
    type: SET_PLAYERS_DATA,
    payload: {
      matchmaking: {
        playersData: playersData,
      },
    },
  });
}
