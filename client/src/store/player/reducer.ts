import combineReducers from '@saurookkadookk/react-utils-combine-reducers';

import { safeParseJSON, type PlayerID } from '@connect-four-app/shared';
import { PLAYER_DETAILS_LS_KEY } from '@/constants';
import { REGISTER_NEW_PLAYER, LOG_IN_PLAYER, SET_PLAYER_ID } from '../actionTypes';

export type PlayerStateSlice = {
  playerID: PlayerID | null;
  username: string | null;
};

// TODO: maybe use `sessionStorage` instead?
function getInitialPlayerStateFromLocalStorage(): PlayerStateSlice {
  const storedPlayerDetails = window.localStorage.getItem(PLAYER_DETAILS_LS_KEY);
  const parsedDetails = safeParseJSON(storedPlayerDetails) as Record<string, any>;

  return {
    playerID: parsedDetails?.playerID ?? null,
    username: parsedDetails?.username ?? null,
  };
}

export const initialPlayerStateSlice = getInitialPlayerStateFromLocalStorage();

const playerID: CombinedPlayerStateSlice['playerID'] = [
  (stateSlice, action) => {
    switch (action.type) {
      case REGISTER_NEW_PLAYER:
      case LOG_IN_PLAYER:
      case SET_PLAYER_ID:
        return action.payload.playerID;
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
        return action.payload.username;
      case LOG_IN_PLAYER:
        return action.payload.username;
      default:
        return stateSlice;
    }
  },
  initialPlayerStateSlice.username,
];

export default combineReducers({
  playerID,
  username,
});

type CombinedPlayerStateSlice = {
  playerID: combineReducers.ArgsTuple<
    PlayerStateSlice['playerID'], // force formatting
    PlayerAction
  >;
  username: combineReducers.ArgsTuple<
    PlayerStateSlice['username'], // force formatting
    UsernameAction
  >;
};

type PlayerAction = combineReducers.ReducerAction<{
  playerID?: PlayerStateSlice['playerID'];
}>;

type UsernameAction = combineReducers.ReducerAction<{
  username?: PlayerStateSlice['username'];
}>;
