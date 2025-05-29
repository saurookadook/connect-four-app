import { Connection } from 'mongoose';

import { GAME_SESSION_MODEL } from '@/constants';
import {
  GameSession,
  GameSessionSchema,
} from '@game-engine/schemas/game-session.schema';

export const gameSessionProvider = {
  provide: GAME_SESSION_MODEL,
  useFactory: (connection: Connection) => {
    return connection.model(GameSession.name, GameSessionSchema);
  },
};
