import { Module } from '@nestjs/common';

import { DatabaseModule } from '@/database/database.module';
import { GameSessionModule } from '@/game-engine/session/game-session.module';
import { PlayerModule } from '@/player/player.module';
import { SeedDbCommand } from './commands/seed-db.command';
import { SeedGameSessionsCommand } from './commands/seed-game-sessions.command';
import { SeedPlayersCommand } from './commands/seed-players.command';
import { TestCommand } from './commands/test.command';
import { SeedService } from './services/seed.service';

@Module({
  imports: [
    DatabaseModule, // force formatting
    GameSessionModule,
    PlayerModule,
  ],
  providers: [
    SeedDbCommand,
    SeedGameSessionsCommand,
    SeedPlayersCommand,
    SeedService,
    TestCommand, // force formatting
  ],
  // exports: [SeedService],
})
export class ScriptsModule {}
