import { Body, Controller, Get, Post } from '@nestjs/common';

import { CreateGameSessionDTO } from './dtos/game-session.dto';
import { GameEngineService } from './game-engine.service';

@Controller('games')
export class GameEngineController {
  constructor(private readonly gameEngineService: GameEngineService) {}

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
