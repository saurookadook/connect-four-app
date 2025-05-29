import { Module } from '@nestjs/common';
import * as mongoose from 'mongoose';

import {
  MONGO_CONNECTION_TEST_URL, // force formatting
  MONGO_CONNECTION_TEST_TOKEN,
} from '@/constants';

export const testDatabaseProvider = {
  provide: MONGO_CONNECTION_TEST_TOKEN,
  useFactory: (): Promise<typeof mongoose> =>
    mongoose.connect(MONGO_CONNECTION_TEST_URL),
};

@Module({
  providers: [testDatabaseProvider],
  exports: [testDatabaseProvider],
})
export class TestDatabaseModule {}
