import { Module } from '@nestjs/common';

import { DatabaseModule } from '@/database/database.module';
import { GameSessionModule } from '@/game-engine/session/game-session.module';
import { PlayerModule } from '@/player/player.module';
import { TestCommand } from './commands/test.command';

@Module({
  imports: [
    DatabaseModule, // force formatting
    GameSessionModule,
    PlayerModule,
  ],
  providers: [
    TestCommand, // force formatting
  ],
})
export class ScriptsModule {}
