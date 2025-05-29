import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { testConfig } from '@/config';
import { MongooseModule } from '@nestjs/mongoose';
import { GameSessionModule } from '@/game-engine/session/game-session.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env.test',
      load: [testConfig],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      // eslint-disable-next-line @typescript-eslint/require-await
      useFactory: async (configService: ConfigService) => ({
        uri: `mongodb://${configService.get('database.host')}:${configService.get('database.port')}/${configService.get('database.dbName')}`,
      }),
      inject: [ConfigService],
    }),
    GameSessionModule,
  ],
})
export class TestDatabaseModule {}

// import * as mongoose from 'mongoose';
// import {
//   MONGO_CONNECTION_TEST_URL, // force formatting
//   MONGO_CONNECTION_TEST_TOKEN,
// } from '@/constants';

// export const testDatabaseProvider = {
//   provide: MONGO_CONNECTION_TEST_TOKEN,
//   useFactory: (): Promise<typeof mongoose> =>
//     mongoose.connect(MONGO_CONNECTION_TEST_URL),
// };

// @Module({
//   providers: [testDatabaseProvider],
//   exports: [testDatabaseProvider],
// })
// export class TestDatabaseModule {}
