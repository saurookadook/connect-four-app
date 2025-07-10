import combineReducers from '@saurookkadookk/react-utils-combine-reducers';

import {
  REQUEST_ALL_GAME_SESSIONS,
  REQUEST_GAME_SESSIONS_HISTORY,
  SET_ALL_GAME_SESSIONS,
  SET_GAME_SESSIONS_HISTORY,
} from '@/store';
import { CombinedGameSessionsStateSlice } from './reducer.types';

export const initialGameSessionsStateSlice = {
  allPaginatedRequestInProgress: false,
  allPaginated: null,
  playerHistoryRequestInProgress: false,
  playerHistory: null,
};

export const allPaginatedRequestInProgress: CombinedGameSessionsStateSlice['allPaginatedRequestInProgress'] =
  [
    (stateSlice, action) => {
      switch (action.type) {
        case REQUEST_ALL_GAME_SESSIONS:
          return true;
        case SET_ALL_GAME_SESSIONS:
          return false;
        default:
          return stateSlice;
      }
    },
    initialGameSessionsStateSlice.allPaginatedRequestInProgress,
  ];

const allPaginated: CombinedGameSessionsStateSlice['allPaginated'] = [
  (stateSlice, action) => {
    switch (action.type) {
      case SET_ALL_GAME_SESSIONS:
        return action.payload?.gameSessions?.allPaginated || [];
      default:
        return stateSlice;
    }
  },
  initialGameSessionsStateSlice.allPaginated,
];

export const playerHistoryRequestInProgress: CombinedGameSessionsStateSlice['playerHistoryRequestInProgress'] =
  [
    (stateSlice, action) => {
      switch (action.type) {
        case REQUEST_GAME_SESSIONS_HISTORY:
          return true;
        case SET_GAME_SESSIONS_HISTORY:
          return false;
        default:
          return stateSlice;
      }
    },
    initialGameSessionsStateSlice.playerHistoryRequestInProgress,
  ];

const playerHistory: CombinedGameSessionsStateSlice['playerHistory'] = [
  (stateSlice, action) => {
    switch (action.type) {
      case SET_GAME_SESSIONS_HISTORY:
        return action.payload?.gameSessions?.playerHisory || [];
      default:
        return stateSlice;
    }
  },
  initialGameSessionsStateSlice.playerHistory,
];

export * from './reducer.types';

export default combineReducers({
  allPaginatedRequestInProgress,
  allPaginated,
  playerHistoryRequestInProgress,
  playerHistory,
});
