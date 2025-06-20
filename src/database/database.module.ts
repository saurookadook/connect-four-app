import { Module } from '@nestjs/common';

import { BaseDatabaseProvider, databaseProvider } from './database.provider';

@Module({
  imports: [
    ...BaseDatabaseProvider,
    // databaseProvider
  ],
})
export class DatabaseModule {}
