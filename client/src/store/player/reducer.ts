import combineReducers from '@saurookkadookk/react-utils-combine-reducers';

import { REGISTER_NEW_PLAYER, LOG_IN_PLAYER } from '../actionTypes';

export type PlayerStateSlice = {
  playerID: string | null;
  username: string | null;
};

export const initialPlayerStateSlice = {
  playerID: null,
  username: null,
};

const playerID: CombinedPlayerStateSlice['playerID'] = [
  (stateSlice, action) => {
    switch (action.type) {
      case REGISTER_NEW_PLAYER:
        return action.payload.playerID;
      case LOG_IN_PLAYER:
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
