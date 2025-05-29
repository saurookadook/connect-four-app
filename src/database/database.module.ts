import { Module } from '@nestjs/common';
import * as mongoose from 'mongoose';

import {
  MONGO_CONNECTION_URL, // force formatting
  MONGO_CONNECTION_TOKEN,
} from '@/constants';

export const databaseProvider = {
  provide: MONGO_CONNECTION_TOKEN,
  useFactory: (): Promise<typeof mongoose> =>
    mongoose.connect(MONGO_CONNECTION_URL),
};

@Module({
  providers: [databaseProvider],
  exports: [databaseProvider],
})
export class DatabaseModule {}
