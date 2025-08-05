import combineReducers from '@saurookkadookk/react-utils-combine-reducers';

import { safeParseJSON } from '@connect-four-app/shared';
import { PLAYER_DETAILS_LS_KEY } from '@/constants';
import {
  LOG_IN_PLAYER,
  REGISTER_NEW_PLAYER,
  SET_PLAYER_ID,
  SET_PLAYER_INFO,
  UNSET_PLAYER_INFO,
} from '@/store/actionTypes';
import {
  type CombinedPlayerStateSlice, // force formatting
  type PlayerStateSlice,
} from './reducer.types';

// TODO: maybe use `sessionStorage` instead?
function getInitialPlayerStateFromLocalStorage(): PlayerStateSlice {
  const storedPlayerDetails = window.localStorage.getItem(PLAYER_DETAILS_LS_KEY);
  const parsedDetails = safeParseJSON<{
    playerID: PlayerStateSlice['playerID'];
    playerObjectID: PlayerStateSlice['playerObjectID'];
    username: PlayerStateSlice['username'];
  }>(storedPlayerDetails);

  return {
    email: null,
    playerID: parsedDetails?.playerID ?? null,
    playerObjectID: parsedDetails?.playerObjectID ?? null,
    username: parsedDetails?.username ?? null,
  };
}

export const initialPlayerStateSlice = getInitialPlayerStateFromLocalStorage();

const email: CombinedPlayerStateSlice['email'] = [
  (stateSlice, action) => {
    switch (action.type) {
      case REGISTER_NEW_PLAYER:
      case LOG_IN_PLAYER:
      case SET_PLAYER_ID:
      case SET_PLAYER_INFO:
        return action.payload.player.email ?? null;
      case UNSET_PLAYER_INFO:
        return null;
      default:
        return stateSlice;
    }
  },
  initialPlayerStateSlice.email,
];

const playerID: CombinedPlayerStateSlice['playerID'] = [
  (stateSlice, action) => {
    switch (action.type) {
      case REGISTER_NEW_PLAYER:
      case LOG_IN_PLAYER:
      case SET_PLAYER_ID:
      case SET_PLAYER_INFO:
        return action.payload.player.playerID;
      case UNSET_PLAYER_INFO:
        return null;
      default:
        return stateSlice;
    }
  },
  initialPlayerStateSlice.playerID,
];

const playerObjectID: CombinedPlayerStateSlice['playerObjectID'] = [
  (stateSlice, action) => {
    switch (action.type) {
      case REGISTER_NEW_PLAYER:
      case LOG_IN_PLAYER:
      case SET_PLAYER_INFO:
        return action.payload.player.playerObjectID ?? null;
      case UNSET_PLAYER_INFO:
        return null;
      default:
        return stateSlice;
    }
  },
  initialPlayerStateSlice.playerID,
];

const username: CombinedPlayerStateSlice['username'] = [
  (stateSlice, action) => {
    switch (action.type) {
      case REGISTER_NEW_PLAYER:
      case LOG_IN_PLAYER:
      case SET_PLAYER_INFO:
        return action.payload.player.username;
      case UNSET_PLAYER_INFO:
        return null;
      default:
        return stateSlice;
    }
  },
  initialPlayerStateSlice.username,
];

export * from './reducer.types';

export default combineReducers({
  email,
  playerID,
  playerObjectID,
  username,
});
