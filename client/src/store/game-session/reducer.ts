import combineReducers from '@saurookkadookk/react-utils-combine-reducers';

import {
  GameSessionStatus, // force formatting
  PlayerColor,
  type PlayerID,
  type PlayerMove,
} from '@connect-four-app/shared';
import { createEmptyBoard } from '@/pages/GameSession/utils';
import {
  REQUEST_GAME_SESSION,
  RESET_GAME,
  START_GAME,
  SET_ACTIVE_PLAYER,
  SET_GAME_SESSION,
  SET_GAME_SESSION_ID,
  UPDATE_GAME_STATE,
} from '@/store';
import { CombinedGameSessionStateSlice } from './reducer.types';

export const initialGameSessionStateSlice = {
  gameSessionRequestInProgress: false,
  activePlayer: PlayerColor.RED,
  gameSessionID: null,
  boardCells: createEmptyBoard(),
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

function getActivePlayerColor({
  lastPlayerMove,
  playerOneID,
  playerTwoID,
}: {
  lastPlayerMove: PlayerMove | undefined;
  playerOneID: PlayerID;
  playerTwoID: PlayerID;
}) {
  if (lastPlayerMove == null) {
    return PlayerColor.RED;
  }

  switch (lastPlayerMove.playerID) {
    case playerOneID:
      return PlayerColor.BLACK;
    case playerTwoID:
      return PlayerColor.RED;
    default:
      throw new Error(
        `Mismatched playerID in last move - from lastPlayerMove: '${lastPlayerMove.playerID}' || playerOneID: '${playerOneID} || playerTwoID: '${playerTwoID}'`,
      );
  }
}

const activePlayer: CombinedGameSessionStateSlice['activePlayer'] = [
  (stateSlice, action) => {
    switch (action.type) {
      case RESET_GAME:
        return initialGameSessionStateSlice.activePlayer;
      case START_GAME:
      case UPDATE_GAME_STATE:
      case SET_ACTIVE_PLAYER:
        const { moves, playerOneID, playerTwoID } = action.payload.gameSession;
        return getActivePlayerColor({
          lastPlayerMove: moves.at(-1),
          playerOneID,
          playerTwoID,
        });
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

const boardCells: CombinedGameSessionStateSlice['boardCells'] = [
  (stateSlice, action) => {
    switch (action.type) {
      case RESET_GAME:
        return initialGameSessionStateSlice.boardCells;
      case UPDATE_GAME_STATE:
      case START_GAME:
        return [...action.payload.gameSession.boardCells];
      default:
        return stateSlice;
    }
  },
  initialGameSessionStateSlice.boardCells,
];

const moves: CombinedGameSessionStateSlice['moves'] = [
  (stateSlice, action) => {
    switch (action.type) {
      case RESET_GAME:
        return [...initialGameSessionStateSlice.moves];
      case UPDATE_GAME_STATE:
      case SET_GAME_SESSION:
        return [...action.payload.gameSession.moves];
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
      case UPDATE_GAME_STATE:
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
  boardCells,
  moves,
  playerOneID,
  playerTwoID,
  status,
});
