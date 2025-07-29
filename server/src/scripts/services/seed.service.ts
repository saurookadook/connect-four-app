import { Injectable } from '@nestjs/common';

import { sharedLog } from '@connect-four-app/shared';
import { AuthenticationService } from '@/auth/authentication.service';
import { GameSessionsService } from '@/game-engine/sessions/game-sessions.service';
import { PlayersService } from '@/players/players.service';
import { GameSessionSeed, PlayerSeed } from '@/scripts/seed-data';

const logger = sharedLog.getLogger('SeedService');

@Injectable()
export class SeedService {
  constructor(
    private readonly authenticationService: AuthenticationService,
    private readonly gameSessionsService: GameSessionsService,
    private readonly playersService: PlayersService,
  ) {}

  async seedGameSessions(
    gameSessionsSeedData: GameSessionSeed[],
  ): Promise<void> {
    logger.log(
      '    Seeding game sessions data...    '
        .padStart(120, '=')
        .padEnd(200, '='),
    );

    const createGameSessionPromises = gameSessionsSeedData.map((sessionSeed) =>
      this.gameSessionsService.createOne(sessionSeed),
    );

    await Promise.allSettled(createGameSessionPromises).then((results) =>
      results.forEach((result, index) => {
        if (result.status === 'rejected') {
          logger.error(
            `!!!!!!!!    Error seeding game session data: ${result.reason}`,
          );
        } else {
          const { playerOneID, playerTwoID } = gameSessionsSeedData[index];
          logger.log(
            `-------- Game session for '${playerOneID}' vs '${playerTwoID}' seeded successfully!`,
          );
        }
      }),
    );

    logger.log(
      '    Finished seeding game sessions data!    '
        .padStart(120, '=')
        .padEnd(200, '='),
    );
  }

  async seedPlayers(playersSeedData: PlayerSeed[]): Promise<void> {
    logger.log(
      '    Seeding players data...    '.padStart(120, '=').padEnd(200, '='),
    );

    const createPlayerPromises = playersSeedData.map(async (playerSeed) => {
      const hashedPassword = await AuthenticationService.createPasswordHash(
        playerSeed.password,
      );
      return this.playersService.createOne({
        ...playerSeed,
        password: hashedPassword,
      });
    });

    await Promise.allSettled(createPlayerPromises).then((results) =>
      results.forEach((result, index) => {
        if (result.status === 'rejected') {
          logger.error(
            `!!!!!!!!    Error seeding player data: ${result.reason}`,
          );
        } else {
          logger.log(
            `-------- Player '${playersSeedData[index].username}' seeded successfully!`,
          );
        }
      }),
    );

    logger.log(
      '    Finished seeding players data!    '
        .padStart(120, '=')
        .padEnd(200, '='),
    );
  }
}
