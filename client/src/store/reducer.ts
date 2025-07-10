import combineReducers from '@saurookkadookk/react-utils-combine-reducers';

import connectFourReducer, {
  initialConnectFourStateSlice,
  type ConnectFourStateSlice,
} from '@/store/connect-four/reducer';
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
  connectFour: ConnectFourStateSlice;
  gameSessions: GameSessionsStateSlice;
  messages: MessagesStateSlice;
  player: PlayerStateSlice;
};
// & combineReducers.AmbiguousObject;

export const initialAppState = {
  connectFour: initialConnectFourStateSlice,
  gameSessions: initialGameSessionsStateSlice,
  messages: initialMessagesStateSlice,
  player: initialPlayerStateSlice,
};

export default combineReducers({
  connectFour: connectFourReducer,
  gameSessions: gameSessionsReducer,
  messages: messagesReducer,
  player: playerReducer,
});
