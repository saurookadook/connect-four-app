import { PlayerColor } from '@connect-four-app/shared';
import {
  REQUEST_GAME_SESSION,
  RESET_GAME,
  START_GAME,
  SET_ACTIVE_PLAYER,
  SET_GAME_SESSION,
  SET_GAME_SESSION_ID,
  UPDATE_GAME_STATE,
} from '@/store';
import type { BaseAction } from '@/types/main';
import { safeFetch } from '@/utils/safeFetch';
import { GameSessionStateSlice } from './reducer.types';

export async function fetchGameSession({
  dispatch, // force formatting
  gameSessionID,
}: BaseAction & { gameSessionID: string }) {
  dispatch({ type: REQUEST_GAME_SESSION });

  const responseData = await safeFetch.call(
    { name: fetchGameSession.name },
    {
      requestPathname: `/api/game-sessions/${gameSessionID}`,
      fetchOpts: { method: 'GET' },
    },
  );

  return setGameSession({
    dispatch,
    gameSession: responseData.session || {},
  });
}

export function resetGame({
  dispatch, // force formatting
}: BaseAction) {
  return dispatch({
    type: RESET_GAME,
  });
}

export function setActivePlayer({
  dispatch, // force formatting
  player,
}: BaseAction & { player: PlayerColor }) {
  return dispatch({
    type: SET_ACTIVE_PLAYER,
    payload: {
      gameSession: {
        activePlayer: player,
      },
    },
  });
}

export function setGameSessionID({
  dispatch,
  gameSessionID,
}: BaseAction & { gameSessionID: string }) {
  return dispatch({
    type: SET_GAME_SESSION_ID,
    payload: {
      gameSession: {
        gameSessionID: gameSessionID,
      },
    },
  });
}

export function setGameSession({
  dispatch,
  gameSession,
}: BaseAction & { gameSession: Omit<GameSessionStateSlice, 'activePlayer'> }) {
  return dispatch({
    type: SET_GAME_SESSION,
    payload: {
      gameSession: gameSession,
    },
  });
}

export function startGame({
  dispatch,
  gameSessionData,
}: BaseAction & {
  gameSessionData: Omit<
    GameSessionStateSlice,
    'gameSessionRequestInProgress' | 'activePlayer'
  >;
}) {
  return dispatch({
    type: START_GAME,
    payload: {
      gameSession: gameSessionData,
    },
  });
}

export function updateGameState({
  dispatch,
  currentActivePlayer,
  gameSessionData,
}: BaseAction & {
  currentActivePlayer?: PlayerColor;
  gameSessionData: Omit<
    GameSessionStateSlice,
    'gameSessionRequestInProgress' | 'activePlayer'
  >;
}) {
  return dispatch({
    type: UPDATE_GAME_STATE,
    payload: {
      gameSession: gameSessionData,
    },
  });
}
