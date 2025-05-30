import * as mongoose from 'mongoose';
import { Schema } from 'mongoose';
import { ConfigService } from '@nestjs/config';

import { MONGO_DB_CONNECTION } from '@/constants/db';
import { GameSessionStatus } from '@/constants/game';
import {
  MoveSchema,
  GameSessionSchema,
} from '@game-engine/schemas/game-session.schema';

function registerModels() {
  const GameSession = mongoose.model('GameSession', GameSessionSchema);

  return {
    GameSession,
  };
}

export const databaseProvider = {
  provide: MONGO_DB_CONNECTION,
  useFactory: async (configService: ConfigService) => {
    registerModels();

    console.log({
      name: 'databaseProvider.userFactory',
      databaseHost: configService.get('database.host'),
      databasePort: configService.get('database.port'),
      databaseDbName: configService.get('database.dbName'),
    });
    const connectionURL = `mongodb://${configService.get('database.host')}:${configService.get('database.port')}/${configService.get('database.dbName')}`;
    const connection = await mongoose.connect(connectionURL, {
      autoIndex: process.env.NODE_ENV !== 'production',
      bufferCommands: false,
      serverSelectionTimeoutMS: process.env.NODE_ENV === 'test' ? 2000 : 30000,
    });
    return connection;
  },
  inject: [ConfigService],
};
