import { inspect } from 'node:util';
import { Injectable } from '@nestjs/common';
import { Types } from 'mongoose';

import { sharedLog } from '@connect-four-app/shared';
import { AuthenticationService } from '@/auth/authentication.service';
import { GameSessionDocument } from '@/game-engine/schemas';
import { GameSessionsService } from '@/game-engine/sessions/game-sessions.service';
import { PlayerDocument } from '@/players/schemas/player.schema';
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

    for (const sessionSeed of gameSessionsSeedData) {
      try {
        const gameSession =
          await this.gameSessionsService.createOne(sessionSeed);

        await this.populatePlayersForGameSession(gameSession);

        const { playerOneID, playerTwoID } = gameSession;
        logger.log(
          `-------- Game session for '${playerOneID}' vs '${playerTwoID}' seeded successfully!`,
        );
      } catch (error) {
        logger.error(
          `!!!!!!!!    Error seeding game session data: ${error.message}`,
          error,
        );
      }
    }

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

  async populatePlayersForGameSession(gameSession: GameSessionDocument) {
    let populated = await gameSession.populate('playerOne');
    console.log(
      `${' '.repeat(12)}BEFORE: 'populated' result for game session ${gameSession._id.toJSON()} ${'-'.repeat(100)}`,
      inspect(populated, { colors: true, compact: false, depth: 2 }),
      '\n',
    );

    if (populated.playerOne != null && populated.playerTwo != null) {
      console.log(
        `${' '.repeat(12)}Skipping populating players for '${gameSession._id.toJSON()}'...`,
        '\n',
      );
      return;
    }

    const updateFields: {
      playerOneObjectID?: Types.ObjectId;
      playerTwoObjectID?: Types.ObjectId;
    } = {};

    if (populated.playerOne == null) {
      const playerOne = (await this.playersService.findOneByPlayerID(
        gameSession.playerOneID,
      )) as PlayerDocument;
      // console.log(
      //   `${' '.repeat(12)}'playerOne' ${'-'.repeat(100)}`,
      //   inspect(playerOne, { colors: true, compact: false, depth: 2 }),
      //   '\n',
      // );

      updateFields.playerOneObjectID = playerOne._id;
    }

    if (populated.playerTwo == null) {
      const playerTwo = (await this.playersService.findOneByPlayerID(
        populated.playerTwoID,
      )) as PlayerDocument;
      // console.log(
      //   `${' '.repeat(12)}'playerTwo' ${'-'.repeat(100)}`,
      //   inspect(playerTwo, { colors: true, compact: false, depth: 2 }),
      //   '\n',
      // );

      updateFields.playerTwoObjectID = playerTwo._id;
    }

    populated = (await this.gameSessionsService.updateOne(
      populated._id.toJSON(),
      {
        ...updateFields,
      },
    )) as GameSessionDocument;

    console.log(
      `${' '.repeat(12)}'populated' : after players update ${'-'.repeat(100)}`,
      inspect(populated, { colors: true, compact: false, depth: 2 }),
      '\n',
    );

    console.log(
      `${' '.repeat(12)}AFTER: 'populated' result for game session ${gameSession._id.toJSON()} ${'-'.repeat(100)}`,
      inspect(populated, { colors: true, compact: false, depth: 2 }),
      '\n',
    );
  }
}
