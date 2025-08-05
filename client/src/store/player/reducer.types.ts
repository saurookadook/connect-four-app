import CombineReducers from '@saurookkadookk/react-utils-combine-reducers';

import { type Nullable, type PlayerID } from '@connect-four-app/shared';

export type PlayerStateSlice = {
  email: Nullable<string>;
  playerID: Nullable<PlayerID>;
  playerObjectID: Nullable<string>;
  username: Nullable<string>;
};

export type PlayerAction = CombineReducers.ReducerAction<{
  email?: PlayerStateSlice['email'];
  playerID?: PlayerStateSlice['playerID'];
  playerObjectID?: PlayerStateSlice['playerObjectID'];
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
  playerObjectID: CombineReducers.ArgsTuple<
    PlayerStateSlice['playerObjectID'], // force formatting
    PlayerAction
  >;
  username: CombineReducers.ArgsTuple<
    PlayerStateSlice['username'], // force formatting
    PlayerAction
  >;
};
