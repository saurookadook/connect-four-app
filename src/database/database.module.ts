import { Module } from '@nestjs/common';

import { databaseProvider } from './database.provider';

@Module({
  providers: [databaseProvider],
})
export class DatabaseModule {}
