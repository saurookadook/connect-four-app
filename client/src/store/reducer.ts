import combineReducers from '@saurookkadookk/react-utils-combine-reducers';

import gameSessionReducer, {
  initialGameSessionStateSlice,
  type GameSessionStateSlice,
} from '@/store/game-session/reducer';
import gameSessionsReducer, {
  initialGameSessionsStateSlice,
  type GameSessionsStateSlice,
} from '@/store/game-sessions/reducer';
import messagesReducer, {
  initialMessagesStateSlice,
  type MessagesStateSlice,
} from '@/store/messages/reducer';
import playerReducer, {
  initialPlayerStateSlice,
  type PlayerStateSlice,
} from '@/store/player/reducer';

export type AppState = {
  gameSession: GameSessionStateSlice;
  gameSessions: GameSessionsStateSlice;
  messages: MessagesStateSlice;
  player: PlayerStateSlice;
};
// & combineReducers.AmbiguousObject;

export const initialAppState = {
  gameSession: initialGameSessionStateSlice,
  gameSessions: initialGameSessionsStateSlice,
  messages: initialMessagesStateSlice,
  player: initialPlayerStateSlice,
};

export default combineReducers({
  gameSession: gameSessionReducer,
  gameSessions: gameSessionsReducer,
  messages: messagesReducer,
  player: playerReducer,
});
