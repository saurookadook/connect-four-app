import combineReducers from '@saurookkadookk/react-utils-combine-reducers';

import gameSessionReducer, {
  initialGameSessionStateSlice,
  type GameSessionStateSlice,
} from '@/store/game-session/reducer';
import gameSessionsReducer, {
  initialGameSessionsStateSlice,
  type GameSessionsStateSlice,
} from '@/store/game-sessions/reducer';
import matchmakingReducer, {
  initialMatchmakingStateSlice,
  type MatchmakingStateSlice,
} from '@/store/matchmaking/reducer';
import playerReducer, {
  initialPlayerStateSlice,
  type PlayerStateSlice,
} from '@/store/player/reducer';

export type AppState = {
  gameSession: GameSessionStateSlice;
  gameSessions: GameSessionsStateSlice;
  matchmaking: MatchmakingStateSlice;
  player: PlayerStateSlice;
};
// & combineReducers.AmbiguousObject;

export const initialAppState = {
  gameSession: initialGameSessionStateSlice,
  gameSessions: initialGameSessionsStateSlice,
  matchmaking: initialMatchmakingStateSlice,
  player: initialPlayerStateSlice,
};

export default combineReducers({
  gameSession: gameSessionReducer,
  gameSessions: gameSessionsReducer,
  matchmaking: matchmakingReducer,
  player: playerReducer,
});
