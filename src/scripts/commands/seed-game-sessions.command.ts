import { Command, CommandRunner } from 'nest-commander';

import { allGameSessionsSeedData } from '@/scripts/seed-data';
import { SeedService } from '@/scripts/services/seed.service';

@Command({
  name: 'seed_game_sessions',
  description: 'Seed game sessions data into the database',
})
export class SeedGameSessionsCommand extends CommandRunner {
  constructor(private readonly seedService: SeedService) {
    super();
  }

  async run(): Promise<void> {
    await this.seedService.seedGameSessions(allGameSessionsSeedData);

    process.exitCode = 0;
  }
}
