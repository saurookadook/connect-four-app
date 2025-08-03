import { inspect } from 'node:util';
import { InjectConnection } from '@nestjs/mongoose';
import { Command, CommandRunner } from 'nest-commander';
import { Connection } from 'mongoose';

import { sharedLog } from '@connect-four-app/shared';
import { GameSessionsService } from '@/game-engine/sessions/game-sessions.service';
import { SeedService } from '@/scripts/services/seed.service';

const logger = sharedLog.getLogger('AddPlayerRefsToGameSessionsCommand');

@Command({
  name: 'add_player_refs_to_game_sessions',
  description:
    "Updates 'GameSession' documents with 'Player' document references",
})
export class AddPlayerRefsToGameSessionsCommand extends CommandRunner {
  constructor(
    @InjectConnection() private dbConn: Connection,
    private readonly gameSessionsService: GameSessionsService,
    private readonly seedService: SeedService,
  ) {
    super();
  }

  async run(): Promise<void> {
    console.log(
      `${' '.repeat(12)}run: MongoDB Connection ${'-'.repeat(100)}`,
      inspect(this.dbConn, {
        colors: true,
        compact: false,
        depth: 1,
        showHidden: true,
        sorted: true,
      }),
      '\n',
    );
    console.log('\n');
    const allGameSessions = await this.gameSessionsService.findAll();

    for (let index = 0; index < allGameSessions.length; index++) {
      const gameSession = allGameSessions[index];
      console.log(
        `${' '.repeat(12)}Game Session #${index} ${'-'.repeat(100)}`,
        inspect(gameSession, { colors: true, compact: false, depth: 2 }),
        '\n',
      );
      await this.seedService.populatePlayersForGameSession(gameSession);
    }

    console.log('\n');

    process.exitCode = 0;
  }
}
