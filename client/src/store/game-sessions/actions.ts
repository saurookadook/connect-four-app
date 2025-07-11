import { BASE_API_SERVER_URL } from '@/constants';
import {
  REQUEST_ALL_GAME_SESSIONS,
  REQUEST_GAME_SESSIONS_HISTORY,
  SET_ALL_GAME_SESSIONS,
  SET_GAME_SESSIONS_HISTORY,
} from '@/store';
import type { BaseAction, GameSessionsItem } from '@/types/main';

export async function fetchAllGameSessions({ dispatch }: BaseAction) {
  dispatch({ type: REQUEST_ALL_GAME_SESSIONS });

  let responseData = null;

  try {
    const requestURL = new URL('/api/game-sessions/all', BASE_API_SERVER_URL);
    const response = await fetch(requestURL, { method: 'GET' });

    if (!response.ok || response.status >= 400) {
      throw new Error(`[ERROR ${response.status}] Failed to fetch game sessions`);
    }

    responseData = await response.json();
  } catch (error) {
    console.error(error);
  }

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

  let responseData = null;

  try {
    const requestURL = new URL(
      `/api/game-sessions/history/${playerID}`, // force formatting
      BASE_API_SERVER_URL,
    );
    const response = await fetch(requestURL, { method: 'GET' });

    if (!response.ok || response.status >= 400) {
      throw new Error(`[ERROR ${response.status}] Failed to fetch game session history`);
    }

    responseData = await response.json();
  } catch (error) {
    console.error(error);
  }

  return setGameSessionsHistory({
    dispatch,
    gameSessions: {
      playerHistory: responseData?.sessions || [],
    },
  });
}

export function setAllGameSessions({
  dispatch, // force formatting
  gameSessions,
}: BaseAction & {
  gameSessions: {
    allPaginated: GameSessionsItem[];
  };
}) {
  dispatch({
    type: SET_ALL_GAME_SESSIONS,
    payload: {
      gameSessions,
    },
  });
}

export function setGameSessionsHistory({
  dispatch, // force formatting
  gameSessions,
}: BaseAction & {
  gameSessions: {
    playerHistory: GameSessionsItem[];
  };
}) {
  dispatch({
    type: SET_GAME_SESSIONS_HISTORY,
    payload: {
      gameSessions,
    },
  });
}
