import type CombineReducers from '@saurookkadookk/react-utils-combine-reducers';

import { PlayerColor } from '@ConnectFour/constants';

export type ConnectFourStateSlice = {
  activePlayer: PlayerColor;
  /** @note This should probably be a `UUID` */
  gameSessionID: string | null;
};

export type ConnectFourPlayerAction = CombineReducers.ReducerAction<{
  player?: PlayerColor;
}>;

export type ConnectFourGameSessionAction = CombineReducers.ReducerAction<{
  gameSessionID?: string;
}>;

export type CombinedConnectFourStateSlice = {
  activePlayer: CombineReducers.ArgsTuple<
    ConnectFourStateSlice['activePlayer'],
    ConnectFourPlayerAction
  >;
  gameSessionID: CombineReducers.ArgsTuple<
    ConnectFourStateSlice['gameSessionID'],
    ConnectFourGameSessionAction
  >;
};
