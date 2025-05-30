import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';

import baseConfig from '@/config';
import { databaseProvider } from './database.provider';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: process.env.NODE_ENV === 'test' ? '.env.test' : '.env',
      isGlobal: true,
      load: [baseConfig],
    }),
  ],
  providers: [databaseProvider],
  exports: [databaseProvider],
})
export class DatabaseModule {}
