import type CombineReducers from '@saurookkadookk/react-utils-combine-reducers';

import {
  GameSessionStatus, // force formatting
  PlayerColor,
  type Nullable,
  type PlayerID,
} from '@connect-four-app/shared';

export type GameSessionStateSlice = {
  gameSessionRequestInProgress: boolean;
  activePlayer: PlayerColor;
  /** @note This should be a Mongo `ObjectId` */
  gameSessionID: Nullable<string>;
  /* TODO: fix this type later */
  moves: unknown[];
  playerOneID: Nullable<PlayerID>;
  playerTwoID: Nullable<PlayerID>;
  status: GameSessionStatus;
};

export type GameSessionPlayerAction = CombineReducers.ReducerAction<{
  player?: PlayerColor;
}>;

export type GameSessionGameSessionAction = CombineReducers.ReducerAction<{
  gameSessionID?: GameSessionStateSlice['gameSessionID'];
  moves?: GameSessionStateSlice['moves'];
  player?: PlayerColor;
  playerOneID?: GameSessionStateSlice['playerOneID'];
  playerTwoID?: GameSessionStateSlice['playerTwoID'];
  status?: GameSessionStateSlice['status'];
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
  gameSessionRequestInProgress: CombineReducers.ArgsTuple<
    GameSessionStateSlice['gameSessionRequestInProgress'],
    GameSessionGameSessionAction
  >;
  moves: CombineReducers.ArgsTuple<
    GameSessionStateSlice['moves'], // force formatting
    GameSessionGameSessionAction
  >;
  playerOneID: CombineReducers.ArgsTuple<
    GameSessionStateSlice['playerOneID'],
    GameSessionGameSessionAction
  >;
  playerTwoID: CombineReducers.ArgsTuple<
    GameSessionStateSlice['playerTwoID'],
    GameSessionGameSessionAction
  >;
  status: CombineReducers.ArgsTuple<
    GameSessionStateSlice['status'], // force formatting
    GameSessionGameSessionAction
  >;
};
