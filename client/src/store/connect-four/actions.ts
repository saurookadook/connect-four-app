import { PlayerColor } from '@ConnectFour/constants';
import { RESET_GAME, SET_ACTIVE_PLAYER } from '@/store';
import type { BaseAction } from '@/types/main';

export function resetGame({
  dispatch, // force formatting
}: BaseAction) {
  dispatch({
    type: RESET_GAME,
  });
}

export function setActivePlayer({
  dispatch, // force formatting
  player,
}: BaseAction & { player: PlayerColor }) {
  dispatch({
    type: SET_ACTIVE_PLAYER,
    payload: {
      activePlayer: player,
    },
  });
}
