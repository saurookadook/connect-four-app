import { Command, CommandRunner } from 'nest-commander';

import { sharedLog } from '@connect-four-app/shared';
import { allGameSessionsSeedData } from '@/scripts/seed-data';
import { SeedService } from '@/scripts/services/seed.service';

const logger = sharedLog.getLogger('SeedGameSessionsCommand');

@Command({
  name: 'seed_game_sessions',
  description: 'Seed game sessions data into the database',
})
export class SeedGameSessionsCommand extends CommandRunner {
  constructor(private readonly seedService: SeedService) {
    super();
  }

  async run(): Promise<void> {
    logger.log('\n');
    await this.seedService.seedGameSessions(allGameSessionsSeedData);
    logger.log('\n');

    process.exitCode = 0;
  }
}
