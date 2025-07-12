import { PlayerColor } from '@ConnectFour/constants';
import { RESET_GAME, SET_ACTIVE_PLAYER, SET_GAME_SESSION_ID } from '@/store';
import type { BaseAction } from '@/types/main';

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
      connectFour: {
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
      connectFour: {
        gameSessionID: gameSessionID,
      },
    },
  });
}
