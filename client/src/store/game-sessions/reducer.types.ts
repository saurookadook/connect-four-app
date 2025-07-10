import type CombineReducers from '@saurookkadookk/react-utils-combine-reducers';

import { GameSessionsItem } from '@/types/main';

export type GameSessionsStateSlice = {
  allPaginatedRequestInProgress: boolean;
  allPaginated: GameSessionsItem[] | null;
  playerHistoryRequestInProgress: boolean;
  playerHistory: GameSessionsItem[] | null;
};

export type GameSessionsSessionsAction = CombineReducers.ReducerAction<{
  allPaginatedRequestInProgress?: GameSessionsStateSlice['allPaginatedRequestInProgress'];
  allPaginated?: GameSessionsStateSlice['allPaginated'];
  playerHistoryRequestInProgress?: GameSessionsStateSlice['playerHistoryRequestInProgress'];
  playerHistory?: GameSessionsStateSlice['playerHistory'];
}>;

export type CombinedGameSessionsStateSlice = {
  allPaginatedRequestInProgress: CombineReducers.ArgsTuple<
    GameSessionsStateSlice['allPaginatedRequestInProgress'],
    GameSessionsSessionsAction
  >;
  allPaginated: CombineReducers.ArgsTuple<
    GameSessionsStateSlice['allPaginated'],
    GameSessionsSessionsAction
  >;
  playerHistoryRequestInProgress: CombineReducers.ArgsTuple<
    GameSessionsStateSlice['playerHistoryRequestInProgress'],
    GameSessionsSessionsAction
  >;
  playerHistory: CombineReducers.ArgsTuple<
    GameSessionsStateSlice['playerHistory'],
    GameSessionsSessionsAction
  >;
};
