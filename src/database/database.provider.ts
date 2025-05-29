import * as mongoose from 'mongoose';
import { ConfigService } from '@nestjs/config';

import { MONGO_DB_CONNECTION } from '@/constants/db';

export const databaseProvider = {
  provide: MONGO_DB_CONNECTION,
  useFactory: async (configService: ConfigService) => {
    const connectionURL = `mongodb://${configService.get('database.host')}:${configService.get('database.port')}/${configService.get('database.dbName')}`;
    const connection = await mongoose.connect(connectionURL);
    return connection;
  },
  inject: [ConfigService],
};
