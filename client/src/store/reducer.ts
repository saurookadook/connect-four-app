import combineReducers from '@saurookkadookk/react-utils-combine-reducers';

import gameSessionReducer, {
  initialGameSessionStateSlice,
  type GameSessionStateSlice,
} from '@/store/game-session/reducer';
import gameSessionsReducer, {
  initialGameSessionsStateSlice,
  type GameSessionsStateSlice,
} from '@/store/game-sessions/reducer';
import playerReducer, {
  initialPlayerStateSlice,
  type PlayerStateSlice,
} from '@/store/player/reducer';

export type AppState = {
  gameSession: GameSessionStateSlice;
  gameSessions: GameSessionsStateSlice;
  player: PlayerStateSlice;
};
// & combineReducers.AmbiguousObject;

export const initialAppState = {
  gameSession: initialGameSessionStateSlice,
  gameSessions: initialGameSessionsStateSlice,
  player: initialPlayerStateSlice,
};

export default combineReducers({
  gameSession: gameSessionReducer,
  gameSessions: gameSessionsReducer,
  player: playerReducer,
});
