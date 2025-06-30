import { Command, CommandRunner } from 'nest-commander';

import { playersSeedData } from '@/scripts/seed-data';
import { SeedService } from '@/scripts/services/seed.service';

@Command({
  name: 'seed_players',
  description: 'Seed players data into the database',
})
export class SeedPlayersCommand extends CommandRunner {
  constructor(private readonly seedService: SeedService) {
    super();
  }

  async run(): Promise<void> {
    console.log('\n');
    await this.seedService.seedPlayers(playersSeedData);
    console.log('\n');

    process.exitCode = 0;
  }
}
