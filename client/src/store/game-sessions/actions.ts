import {
  REQUEST_ALL_GAME_SESSIONS,
  REQUEST_GAME_SESSIONS_HISTORY,
  SET_ALL_GAME_SESSIONS,
  SET_GAME_SESSIONS_HISTORY,
} from '@/store';
import type { BaseAction, GameSessionsItem } from '@/types/main';
import { safeFetch } from '@/utils/safeFetch';

export async function fetchAllGameSessions({ dispatch }: BaseAction) {
  dispatch({ type: REQUEST_ALL_GAME_SESSIONS });

  const responseData = await safeFetch.call(
    { name: fetchAllGameSessions.name },
    {
      requestPathname: '/api/game-sessions/all',
      fetchOpts: { method: 'GET' },
    },
  );

  return setAllGameSessions({
    dispatch,
    gameSessions: {
      allPaginated: responseData?.sessions || [],
    },
  });
}

export async function fetchGameSessionsHistory({
  dispatch, // force formatting
  playerID,
}: BaseAction & { playerID: string | null }) {
  dispatch({ type: REQUEST_GAME_SESSIONS_HISTORY });

  const responseData = await safeFetch.call(
    {
      name: fetchGameSessionsHistory.name,
    },
    {
      requestPathname: `/api/game-sessions/history/${playerID}`, // force formatting
      fetchOpts: { method: 'GET' },
    },
  );

  return setGameSessionsHistory({
    dispatch,
    gameSessions: {
      playerHistory: responseData?.sessions || [],
    },
  });
}

type AllGameSessions = {
  gameSessions: {
    allPaginated: GameSessionsItem[];
  };
};

export function setAllGameSessions({
  dispatch, // force formatting
  gameSessions,
}: BaseAction & AllGameSessions) {
  dispatch({
    type: SET_ALL_GAME_SESSIONS,
    payload: {
      gameSessions,
    },
  });
}

type GameSessionsHistory = {
  gameSessions: {
    playerHistory: GameSessionsItem[];
  };
};

export function setGameSessionsHistory({
  dispatch, // force formatting
  gameSessions,
}: BaseAction & GameSessionsHistory) {
  dispatch({
    type: SET_GAME_SESSIONS_HISTORY,
    payload: {
      gameSessions,
    },
  });
}
