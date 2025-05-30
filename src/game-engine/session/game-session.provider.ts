import { Connection } from 'mongoose';

import { MONGO_DB_CONNECTION, GAME_SESSION_MODEL } from '@/constants';
import { GameSessionSchema } from '@game-engine/schemas/game-session.schema';

export const gameSessionProvider = {
  provide: GAME_SESSION_MODEL,
  useFactory: (connection: Connection) => {
    console.log('[GameSessionSchema] - useFactory hook triggered');
    GameSessionSchema.pre('save', function () {
      console.log('[GameSessionSchema] - Pre-save hook triggered');
    });
    GameSessionSchema.post('save', function () {
      console.log('[GameSessionSchema] - Post-save hook triggered');
    });
    // schema.on('error', (error) => {
    //   console.error('[GameSessionSchema] - Error:', error);
    // });
    return connection.model(GAME_SESSION_MODEL, GameSessionSchema);
  },
  inject: [MONGO_DB_CONNECTION],
};
