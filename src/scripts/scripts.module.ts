import { Module } from '@nestjs/common';

import { DatabaseModule } from '@/database/database.module';
import { GameSessionModule } from '@/game-engine/session/game-session.module';
import { PlayerModule } from '@/player/player.module';
import { SeedPlayersCommand } from './commands/seed-players.command';
import { TestCommand } from './commands/test.command';

@Module({
  imports: [
    DatabaseModule, // force formatting
    GameSessionModule,
    PlayerModule,
  ],
  providers: [
    SeedPlayersCommand, // force formatting
    TestCommand,
  ],
})
export class ScriptsModule {}
