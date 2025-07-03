import { Module } from '@nestjs/common';

import { AuthenticationService } from '@/auth/authentication.service';
import { DatabaseModule } from '@/database/database.module';
import { GameSessionsModule } from '@/game-engine/sessions/game-sessions.module';
import { PlayerModule } from '@/player/player.module';
import { SeedDbCommand } from './commands/seed-db.command';
import { SeedGameSessionsCommand } from './commands/seed-game-sessions.command';
import { SeedPlayersCommand } from './commands/seed-players.command';
import { TestCommand } from './commands/test.command';
import { SeedService } from './services/seed.service';

@Module({
  imports: [
    DatabaseModule, // force formatting
    GameSessionsModule,
    PlayerModule,
  ],
  providers: [
    AuthenticationService,
    SeedService,
    // COMMANDS
    TestCommand,
    SeedDbCommand,
    SeedGameSessionsCommand,
    SeedPlayersCommand,
  ],
  // exports: [SeedService],
})
export class ScriptsModule {}
