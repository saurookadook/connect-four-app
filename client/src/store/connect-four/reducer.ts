import combineReducers from '@saurookkadookk/react-utils-combine-reducers';

import { PlayerColor } from '@/pages/ConnectFour/constants';
import { RESET_GAME, SET_ACTIVE_PLAYER, SET_GAME_SESSION_ID } from '@/store';
import { CombinedConnectFourStateSlice } from './reducer.types';

export const initialConnectFourStateSlice = {
  activePlayer: PlayerColor.RED,
  gameSessionID: null,
};

const activePlayer: CombinedConnectFourStateSlice['activePlayer'] = [
  (stateSlice, action) => {
    switch (action.type) {
      case RESET_GAME:
        return initialConnectFourStateSlice.activePlayer;
      case SET_ACTIVE_PLAYER:
        return action.payload.connectFour.activePlayer;
      default:
        return stateSlice;
    }
  },
  initialConnectFourStateSlice.activePlayer,
];

const gameSessionID: CombinedConnectFourStateSlice['gameSessionID'] = [
  (stateSlice, action) => {
    switch (action.type) {
      case RESET_GAME:
        return initialConnectFourStateSlice.gameSessionID;
      case SET_GAME_SESSION_ID:
        return action.payload.connectFour.gameSessionID;
      default:
        return stateSlice;
    }
  },
  initialConnectFourStateSlice.gameSessionID,
];

export * from './reducer.types';

export default combineReducers({
  activePlayer,
  gameSessionID,
});
