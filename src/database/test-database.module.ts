import { Module } from '@nestjs/common';
import { testDatabaseProvider } from './database.providers';

@Module({
  providers: [testDatabaseProvider],
  exports: [testDatabaseProvider],
})
export class TestDatabaseModule {}
