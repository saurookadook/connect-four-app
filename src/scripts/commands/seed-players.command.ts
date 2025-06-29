import { Command, CommandRunner } from 'nest-commander';

import { PlayerService } from '@/player/player.service';
import { playersSeedData } from '@/scripts/seed-data';

@Command({
  name: 'seed_players',
  description: 'Seed players data into the database',
})
export class SeedPlayersCommand extends CommandRunner {
  constructor(private readonly playerService: PlayerService) {
    super();
  }

  async run(): Promise<void> {
    console.log(
      '    Seeding players data...    '.padStart(120, '=').padEnd(200, '='),
    );

    const createPlayerPromises = playersSeedData.map((playerSeed) =>
      this.playerService.createOne(playerSeed),
    );

    await Promise.allSettled(createPlayerPromises).then((results) =>
      results.forEach((result, index) => {
        if (result.status === 'rejected') {
          console.error(
            `!!!!!!!!    Error seeding player data: ${result.reason}`,
          );
        } else {
          console.log(
            `-------- Player '${playersSeedData[index].username}' seeded successfully!`,
          );
        }
      }),
    );

    console.log(
      '    Finished seeding players data!    '
        .padStart(120, '=')
        .padEnd(200, '='),
    );
    process.exitCode = 0;
  }
}
