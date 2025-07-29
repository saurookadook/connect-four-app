import { inspect } from 'node:util';
import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';

import { sharedLog, type PlayerID } from '@connect-four-app/shared';
import { PlayerDTO } from './dtos/player.dto';
import { PlayersService } from './players.service';

const logger = sharedLog.getLogger('PlayersController');
logger.setLevel('debug');

@Controller('players')
export class PlayersController {
  constructor(private readonly playersService: PlayersService) {}

  @Get('all')
  async getAllPlayers(
    @Param('playerID') playerID: PlayerID, // force formatting
    @Query('currentPlayerID') currentPlayerID: string,
  ): Promise<{ players: PlayerDTO[] }> {
    logger.debug(
      `[${this.getAllPlayers.name} method] Call arguments\n`,
      inspect({
        playerID,
        currentPlayerID,
      }),
    );

    return {
      players: [],
    };
  }

  @Get(':playerID')
  async getPlayerByPlayerID(
    @Param('playerID') playerID: PlayerID, // force formatting
  ): Promise<{ player: PlayerDTO }> {
    logger.debug(
      `[${this.getPlayerByPlayerID.name} method] Call arguments\n`,
      inspect({
        playerID,
      }),
    );

    return {
      // @ts-expect-error: Just for now :]
      player: null,
    };
  }
}
