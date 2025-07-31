import CombineReducers from '@saurookkadookk/react-utils-combine-reducers';

import { type Nullable, type PlayerID } from '@connect-four-app/shared';

type PlayerData = {
  playerID: PlayerID;
  username: string;
};

export type MatchmakingStateSlice = {
  playersDataRequestInProgress: boolean;
  playersData: PlayerData[];
};

export type PlayerAction = CombineReducers.ReducerAction<{
  playersData?: MatchmakingStateSlice['playersData'];
}>;

export type CombinedMatchmakingStateSlice = {
  playersDataRequestInProgress: CombineReducers.ArgsTuple<
    MatchmakingStateSlice['playersDataRequestInProgress'], // force formatting
    PlayerAction
  >;
  playersData: CombineReducers.ArgsTuple<
    MatchmakingStateSlice['playersData'], // force formatting
    PlayerAction
  >;
};
