import { Command, CommandRunner } from 'nest-commander';

import { allGameSessionsSeedData, playersSeedData } from '@/scripts/seed-data';
import { SeedService } from '@/scripts/services/seed.service';

@Command({
  name: 'seed_db',
  description: 'Seed the database with initial data',
})
export class SeedDbCommand extends CommandRunner {
  constructor(private readonly seedService: SeedService) {
    super();
  }

  async run(): Promise<void> {
    await this.seedService.seedPlayers(playersSeedData);
    await this.seedService.seedGameSessions(allGameSessionsSeedData);

    process.exitCode = 0;
  }
}
