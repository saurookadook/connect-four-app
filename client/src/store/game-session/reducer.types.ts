import type CombineReducers from '@saurookkadookk/react-utils-combine-reducers';

import {
  GameSessionStatus, // force formatting
  PlayerColor,
  PlayerMove,
  type GameBoard,
  type Nullable,
  type PlayerID,
} from '@connect-four-app/shared';

export type GameSessionStateSlice = {
  gameSessionRequestInProgress: boolean;
  activePlayer: PlayerColor;
  /** @note This should be a Mongo `ObjectId` */
  gameSessionID: Nullable<string>;
  boardCells: GameBoard;
  moves: PlayerMove[];
  playerOneID: Nullable<PlayerID>;
  playerOneUsername: Nullable<string>;
  playerTwoID: Nullable<PlayerID>;
  playerTwoUsername: Nullable<string>;
  status: GameSessionStatus;
  winner: Nullable<PlayerID>;
};

export type GameSessionPlayerAction = CombineReducers.ReducerAction<{
  player?: PlayerColor;
}>;

export type GameSessionGameSessionAction = CombineReducers.ReducerAction<{
  gameSessionID?: GameSessionStateSlice['gameSessionID'];
  boardCells?: GameSessionStateSlice['boardCells'];
  moves?: GameSessionStateSlice['moves'];
  player?: PlayerColor;
  playerOneID?: GameSessionStateSlice['playerOneID'];
  playerOneUsername?: GameSessionStateSlice['playerOneUsername'];
  playerTwoID?: GameSessionStateSlice['playerTwoID'];
  playerTwoUsername?: GameSessionStateSlice['playerTwoUsername'];
  status?: GameSessionStateSlice['status'];
  winner?: GameSessionStateSlice['winner'];
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
  boardCells: CombineReducers.ArgsTuple<
    GameSessionStateSlice['boardCells'], // force formatting
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
  playerOneUsername: CombineReducers.ArgsTuple<
    GameSessionStateSlice['playerOneUsername'],
    GameSessionGameSessionAction
  >;
  playerTwoID: CombineReducers.ArgsTuple<
    GameSessionStateSlice['playerTwoID'],
    GameSessionGameSessionAction
  >;
  playerTwoUsername: CombineReducers.ArgsTuple<
    GameSessionStateSlice['playerTwoUsername'],
    GameSessionGameSessionAction
  >;
  status: CombineReducers.ArgsTuple<
    GameSessionStateSlice['status'], // force formatting
    GameSessionGameSessionAction
  >;
  winner: CombineReducers.ArgsTuple<
    GameSessionStateSlice['winner'], // force formatting
    GameSessionGameSessionAction
  >;
};
