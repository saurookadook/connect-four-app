import { inspect } from 'node:util';
import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';

import { sharedLog, type PlayerID } from '@connect-four-app/shared';
import { PlayerDTO } from './dtos/player.dto';
import {
  PlayersService,
  type PlayerFilterOptions,
  type SortOptions,
} from './players.service';

type FindAllOptions = {
  filterOpts?: PlayerFilterOptions;
  sortOpts?: SortOptions;
};

const logger = sharedLog.getLogger('PlayersController');
logger.setLevel('debug');

@Controller('players')
export class PlayersController {
  constructor(private readonly playersService: PlayersService) {}

  @Get('all')
  async getAllPlayers(
    @Query('currentPlayerID', new ParseUUIDPipe({ optional: true }))
    currentPlayerID?: string, // force formatting
  ): Promise<{ playersData: Pick<PlayerDTO, 'playerID' | 'username'>[] }> {
    const methodName = this.getAllPlayers.name;
    logger.trace(
      `[${methodName} method] Call arguments\n`,
      inspect({
        currentPlayerID,
      }),
    );

    const opts: FindAllOptions = {};
    if (currentPlayerID != null) {
      opts.filterOpts = { playerID: { $nin: [currentPlayerID] } };
    }

    const foundPlayers = await this.playersService.findAll(opts);

    return {
      playersData: foundPlayers,
    };
  }

  @Get(':playerID')
  async getPlayerByPlayerID(
    @Param('playerID', ParseUUIDPipe) playerID: PlayerID, // force formatting
  ): Promise<{ player: PlayerDTO }> {
    const methodName = this.getPlayerByPlayerID.name;
    logger.trace(
      `[${methodName} method] Call arguments\n`,
      inspect({
        playerID,
      }),
    );

    const foundPlayer = await this.playersService.findOneByPlayerID(playerID);

    logger.trace(
      `[${methodName} method] Found player document\n`,
      inspect({
        foundPlayer,
      }),
    );

    if (foundPlayer == null) {
      throw new NotFoundException(
        `[PlayersController.${methodName}] : Could not find 'player' with ID '${playerID}'.`,
      );
    }

    return {
      player: plainToInstance(PlayerDTO, foundPlayer.toJSON()),
    };
  }
}
