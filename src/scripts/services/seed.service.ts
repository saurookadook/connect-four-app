import { Injectable } from '@nestjs/common';

import { GameSessionService } from '@/game-engine/session/game-session.service';
import { PlayerService } from '@/player/player.service';
import { GameSessionSeed, PlayerSeed } from '@/scripts/seed-data';

@Injectable()
export class SeedService {
  constructor(
    private readonly gameSessionService: GameSessionService,
    private readonly playerService: PlayerService,
  ) {}

  async seedGameSessions(
    gameSessionsSeedData: GameSessionSeed[],
  ): Promise<void> {
    console.log(
      '    Seeding game sessions data...    '
        .padStart(120, '=')
        .padEnd(200, '='),
    );

    const createGameSessionPromises = gameSessionsSeedData.map((sessionSeed) =>
      this.gameSessionService.createOne(sessionSeed),
    );

    await Promise.allSettled(createGameSessionPromises).then((results) =>
      results.forEach((result, index) => {
        if (result.status === 'rejected') {
          console.error(
            `!!!!!!!!    Error seeding game session data: ${result.reason}`,
          );
        } else {
          const { playerOneID, playerTwoID } = gameSessionsSeedData[index];
          console.log(
            `-------- Game session for '${playerOneID}' vs '${playerTwoID}' seeded successfully!`,
          );
        }
      }),
    );

    console.log(
      '    Finished seeding game sessions data!    '
        .padStart(120, '=')
        .padEnd(200, '='),
    );
  }

  async seedPlayers(playersSeedData: PlayerSeed[]): Promise<void> {
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
  }
}
