import combineReducers from '@saurookkadookk/react-utils-combine-reducers';

import { PlayerColor } from '@/pages/GameSession/constants';
import { RESET_GAME, SET_ACTIVE_PLAYER, SET_GAME_SESSION_ID } from '@/store';
import { CombinedGameSessionStateSlice } from './reducer.types';

export const initialGameSessionStateSlice = {
  activePlayer: PlayerColor.RED,
  gameSessionID: null,
};

const activePlayer: CombinedGameSessionStateSlice['activePlayer'] = [
  (stateSlice, action) => {
    switch (action.type) {
      case RESET_GAME:
        return initialGameSessionStateSlice.activePlayer;
      case SET_ACTIVE_PLAYER:
        return action.payload.connectFour.activePlayer;
      default:
        return stateSlice;
    }
  },
  initialGameSessionStateSlice.activePlayer,
];

const gameSessionID: CombinedGameSessionStateSlice['gameSessionID'] = [
  (stateSlice, action) => {
    switch (action.type) {
      case RESET_GAME:
        return initialGameSessionStateSlice.gameSessionID;
      case SET_GAME_SESSION_ID:
        return action.payload.connectFour.gameSessionID;
      default:
        return stateSlice;
    }
  },
  initialGameSessionStateSlice.gameSessionID,
];

export * from './reducer.types';

export default combineReducers({
  activePlayer,
  gameSessionID,
});
