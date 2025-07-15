import combineReducers from '@saurookkadookk/react-utils-combine-reducers';

import { GameSessionStatus, PlayerColor } from '@/pages/GameSession/constants';
import {
  REQUEST_GAME_SESSION,
  RESET_GAME,
  SET_ACTIVE_PLAYER,
  SET_GAME_SESSION,
  SET_GAME_SESSION_ID,
} from '@/store';
import { CombinedGameSessionStateSlice } from './reducer.types';

export const initialGameSessionStateSlice = {
  gameSessionRequestInProgress: false,
  activePlayer: PlayerColor.RED,
  gameSessionID: null,
  moves: [],
  playerOneID: null,
  playerTwoID: null,
  status: GameSessionStatus.ACTIVE,
};

export const gameSessionRequestInProgress: CombinedGameSessionStateSlice['gameSessionRequestInProgress'] =
  [
    (stateSlice, action) => {
      switch (action.type) {
        case REQUEST_GAME_SESSION:
          return true;
        case SET_GAME_SESSION:
          return false;
        default:
          return stateSlice;
      }
    },
    initialGameSessionStateSlice.gameSessionRequestInProgress,
  ];

const activePlayer: CombinedGameSessionStateSlice['activePlayer'] = [
  (stateSlice, action) => {
    switch (action.type) {
      case RESET_GAME:
        return initialGameSessionStateSlice.activePlayer;
      case SET_ACTIVE_PLAYER:
        return action.payload.gameSession.activePlayer;
      default:
        return stateSlice;
    }
  },
  initialGameSessionStateSlice.activePlayer,
];

const gameSessionID: CombinedGameSessionStateSlice['gameSessionID'] = [
  (stateSlice, action) => {
    switch (action.type) {
      case RESET_GAME:
        return initialGameSessionStateSlice.gameSessionID;
      case SET_GAME_SESSION_ID:
        return action.payload.gameSession.gameSessionID;
      case SET_GAME_SESSION:
        return action.payload.gameSession.id;
      default:
        return stateSlice;
    }
  },
  initialGameSessionStateSlice.gameSessionID,
];

const moves: CombinedGameSessionStateSlice['moves'] = [
  (stateSlice, action) => {
    switch (action.type) {
      case RESET_GAME:
        return initialGameSessionStateSlice.moves;
      case SET_GAME_SESSION:
        return action.payload.gameSession.moves;
      default:
        return stateSlice;
    }
  },
  initialGameSessionStateSlice.moves,
];

const playerOneID: CombinedGameSessionStateSlice['playerOneID'] = [
  (stateSlice, action) => {
    switch (action.type) {
      case RESET_GAME:
        return initialGameSessionStateSlice.playerOneID;
      case SET_GAME_SESSION:
        return action.payload.gameSession.playerOneID;
      default:
        return stateSlice;
    }
  },
  initialGameSessionStateSlice.playerOneID,
];

const playerTwoID: CombinedGameSessionStateSlice['playerTwoID'] = [
  (stateSlice, action) => {
    switch (action.type) {
      case RESET_GAME:
        return initialGameSessionStateSlice.playerTwoID;
      case SET_GAME_SESSION:
        return action.payload.gameSession.playerTwoID;
      default:
        return stateSlice;
    }
  },
  initialGameSessionStateSlice.playerTwoID,
];

const status: CombinedGameSessionStateSlice['status'] = [
  (stateSlice, action) => {
    switch (action.type) {
      case RESET_GAME:
        return initialGameSessionStateSlice.status;
      case SET_GAME_SESSION:
        return action.payload.gameSession.status;
      default:
        return stateSlice;
    }
  },
  initialGameSessionStateSlice.status,
];

export * from './reducer.types';

export default combineReducers({
  gameSessionRequestInProgress,
  activePlayer,
  gameSessionID,
  moves,
  playerOneID,
  playerTwoID,
  status,
});
