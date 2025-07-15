import {
  REQUEST_ALL_GAME_SESSIONS,
  REQUEST_GAME_SESSIONS_HISTORY,
  SET_ALL_GAME_SESSIONS,
  SET_GAME_SESSIONS_HISTORY,
} from '@/store';
import type { BaseAction, BoundThis, GameSessionsItem } from '@/types/main';
import { safeFetch } from '@/utils/safeFetch';

async function $fetchAllGameSessions(this: BoundThis, { dispatch }: BaseAction) {
  dispatch({ type: REQUEST_ALL_GAME_SESSIONS });

  const responseData = await safeFetch.call(this, {
    requestPathname: '/api/game-sessions/all',
    fetchOpts: { method: 'GET' },
  });

  return setAllGameSessions({
    dispatch,
    gameSessions: {
      allPaginated: responseData?.sessions || [],
    },
  });
}

export const fetchAllGameSessions = $fetchAllGameSessions.bind({
  name: $fetchAllGameSessions.name,
});

async function $fetchGameSessionsHistory(
  this: BoundThis,
  {
    dispatch, // force formatting
    playerID,
  }: BaseAction & { playerID: string | null },
) {
  dispatch({ type: REQUEST_GAME_SESSIONS_HISTORY });

  const responseData = await safeFetch.call(this, {
    requestPathname: `/api/game-sessions/history/${playerID}`, // force formatting
    fetchOpts: { method: 'GET' },
  });

  return setGameSessionsHistory({
    dispatch,
    gameSessions: {
      playerHistory: responseData?.sessions || [],
    },
  });
}

export const fetchGameSessionsHistory = $fetchGameSessionsHistory.bind({
  name: $fetchGameSessionsHistory.name,
});

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
