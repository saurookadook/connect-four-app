import { PlayerColor } from '@connect-four-app/shared';
import {
  REQUEST_GAME_SESSION,
  RESET_GAME,
  SET_ACTIVE_PLAYER,
  SET_GAME_SESSION,
  SET_GAME_SESSION_ID,
} from '@/store';
import type { BaseAction, BoundThis } from '@/types/main';
import { safeFetch } from '@/utils/safeFetch';
import { GameSessionStateSlice } from './reducer.types';

async function $fetchGameSession(
  this: BoundThis,
  {
    dispatch, // force formatting
    gameSessionID,
  }: BaseAction & { gameSessionID: string },
) {
  dispatch({ type: REQUEST_GAME_SESSION });

  const responseData = await safeFetch.call(this, {
    requestPathname: `/api/game-sessions/${gameSessionID}`,
    fetchOpts: { method: 'GET' },
  });

  return setGameSession({
    dispatch,
    gameSession: responseData.session || {},
  });
}

export const fetchGameSession = $fetchGameSession.bind({
  name: $fetchGameSession.name,
});

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
