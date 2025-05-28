import * as mongoose from 'mongoose';

import {
  MONGO_CONNECTION_URL,
  MONGO_CONNECTION_TOKEN,
  MONGO_CONNECTION_TEST_URL,
  MONGO_CONNECTION_TEST_TOKEN,
} from '@/constants';

export const databaseProvider = {
  provide: MONGO_CONNECTION_TOKEN,
  useFactory: (): Promise<typeof mongoose> =>
    mongoose.connect(MONGO_CONNECTION_URL),
};

export const testDatabaseProvider = {
  provide: MONGO_CONNECTION_TEST_TOKEN,
  useFactory: (): Promise<typeof mongoose> =>
    mongoose.connect(MONGO_CONNECTION_TEST_URL),
};
