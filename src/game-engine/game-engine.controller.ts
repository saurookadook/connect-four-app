import { UUID } from 'crypto';
import * as uuid from 'uuid';
import { Body, Controller, Get, Query, Param, Post } from '@nestjs/common';

import { CreateGameSessionDTO } from './dtos/game-session.dto';
import { GameSessionService } from './session/game-session.service';
import { GameEngineService } from './game-engine.service';

@Controller('games')
export class GameEngineController {
  constructor(
    private readonly gameEngineService: GameEngineService,
    private readonly gameSessionService: GameSessionService,
  ) {}

  @Get(':playerId/all')
  async getAllGamesForPlayer(
    @Param('playerId') playerId: string,
    @Query('activeOnly') activeOnly: boolean = false,
  ) {
    if (!uuid.validate(playerId)) {
      throw new TypeError(
        "[GameEngineController.getAllGamesForPlayer] Parameter for 'playerId' must be a valid UUID.",
      );
    }

    return await this.gameSessionService.findAllForPlayer(playerId as UUID);
  }

  @Post('start')
  async startGame(
    @Body() createGameSessionDTO: CreateGameSessionDTO, // force formatting
  ) {
    return await this.gameEngineService.startGame({
      playerOneID: createGameSessionDTO.playerOneID,
      playerTwoID: createGameSessionDTO.playerTwoID,
    });
  }
}
