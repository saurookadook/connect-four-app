import combineReducers from '@saurookkadookk/react-utils-combine-reducers';

import { safeParseJSON, sharedLog } from '@connect-four-app/shared';
import { REQUEST_PLAYERS_DATA, SET_PLAYERS_DATA } from '@/store';
import { CombinedMatchmakingStateSlice } from './reducer.types';

const logger = sharedLog.getLogger('matchmakingReducer');

export const initialMatchmakingStateSlice = {
  playersDataRequestInProgress: false,
  playersData: null,
};

const playersDataRequestInProgress: CombinedMatchmakingStateSlice['playersDataRequestInProgress'] =
  [
    (stateSlice, action) => {
      switch (action.type) {
        case REQUEST_PLAYERS_DATA:
          return true;
        case SET_PLAYERS_DATA:
          return false;
        default:
          return stateSlice;
      }
    },
    initialMatchmakingStateSlice.playersDataRequestInProgress,
  ];

const playersData: CombinedMatchmakingStateSlice['playersData'] = [
  (stateSlice, action) => {
    switch (action.type) {
      // case REQUEST_PLAYERS_DATA:
      //   return null;
      case SET_PLAYERS_DATA:
        return [...action.payload.matchmaking.playersData];
      default:
        return stateSlice;
    }
  },
  initialMatchmakingStateSlice.playersData,
];

export * from './reducer.types';

export default combineReducers({
  playersDataRequestInProgress,
  playersData,
});
