import { inspect } from 'node:util';
import { InjectConnection } from '@nestjs/mongoose';
import { Command, CommandRunner } from 'nest-commander';
import { Connection, Types } from 'mongoose';

import { sharedLog } from '@connect-four-app/shared';
import { GameSessionDocument } from '@/game-engine/schemas';
import { GameSessionsService } from '@/game-engine/sessions/game-sessions.service';
import { PlayerDocument } from '@/players/schemas/player.schema';
import { PlayersService } from '@/players/players.service';

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
    private readonly playersService: PlayersService,
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
      await this.populatePlayersForGameSession(gameSession);
    }

    console.log('\n');

    process.exitCode = 0;
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
