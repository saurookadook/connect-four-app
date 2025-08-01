import CombineReducers from '@saurookkadookk/react-utils-combine-reducers';

import { type Nullable, type PlayerID } from '@connect-four-app/shared';

export type PlayerStateSlice = {
  email: Nullable<string>;
  playerID: Nullable<PlayerID>;
  username: Nullable<string>;
};

export type PlayerAction = CombineReducers.ReducerAction<{
  email?: PlayerStateSlice['email'];
  playerID?: PlayerStateSlice['playerID'];
  username?: PlayerStateSlice['username'];
}>;

export type CombinedPlayerStateSlice = {
  email: CombineReducers.ArgsTuple<
    PlayerStateSlice['email'], // force formatting
    PlayerAction
  >;
  playerID: CombineReducers.ArgsTuple<
    PlayerStateSlice['playerID'], // force formatting
    PlayerAction
  >;
  username: CombineReducers.ArgsTuple<
    PlayerStateSlice['username'], // force formatting
    PlayerAction
  >;
};
