import type CombineReducers from '@saurookkadookk/react-utils-combine-reducers';

import { PlayerColor } from '@/pages/GameSession/constants';

export type GameSessionStateSlice = {
  activePlayer: PlayerColor;
  /** @note This should probably be a `UUID` */
  gameSessionID: string | null;
};

export type GameSessionPlayerAction = CombineReducers.ReducerAction<{
  player?: PlayerColor;
}>;

export type GameSessionGameSessionAction = CombineReducers.ReducerAction<{
  gameSessionID?: string;
}>;

export type CombinedGameSessionStateSlice = {
  activePlayer: CombineReducers.ArgsTuple<
    GameSessionStateSlice['activePlayer'],
    GameSessionPlayerAction
  >;
  gameSessionID: CombineReducers.ArgsTuple<
    GameSessionStateSlice['gameSessionID'],
    GameSessionGameSessionAction
  >;
};
