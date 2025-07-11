import combineReducers from '@saurookkadookk/react-utils-combine-reducers';

import { PlayerColor } from '@ConnectFour/constants';
import { RESET_GAME, SET_ACTIVE_PLAYER } from '@/store';

export type ConnectFourStateSlice = {
  activePlayer: PlayerColor;
};

type ConnectFourAllItemsAction = combineReducers.ReducerAction<{
  player?: PlayerColor;
}>;

type CombinedConnectFourStateSlice = {
  activePlayer: combineReducers.ArgsTuple<
    ConnectFourStateSlice['activePlayer'],
    ConnectFourAllItemsAction
  >;
};

export const initialConnectFourStateSlice = {
  activePlayer: PlayerColor.RED,
};

const activePlayer: CombinedConnectFourStateSlice['activePlayer'] = [
  (stateSlice, action) => {
    switch (action.type) {
      case RESET_GAME:
        return initialConnectFourStateSlice.activePlayer;
      case SET_ACTIVE_PLAYER:
        return action.payload.activePlayer;
      default:
        return stateSlice;
    }
  },
  initialConnectFourStateSlice.activePlayer,
];

export default combineReducers({
  activePlayer,
});
