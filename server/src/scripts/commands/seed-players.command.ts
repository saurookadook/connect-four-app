import { Command, CommandRunner } from 'nest-commander';

import { sharedLog } from '@connect-four-app/shared';
import { playersSeedData } from '@/scripts/seed-data';
import { SeedService } from '@/scripts/services/seed.service';

const logger = sharedLog.getLogger('SeedPlayersCommand');

@Command({
  name: 'seed_players',
  description: 'Seed players data into the database',
})
export class SeedPlayersCommand extends CommandRunner {
  constructor(private readonly seedService: SeedService) {
    super();
  }

  async run(): Promise<void> {
    logger.debug('\n');
    await this.seedService.seedPlayers(playersSeedData);
    logger.debug('\n');

    process.exitCode = 0;
  }
}
