import { Body, Controller, Post } from '@nestjs/common';

import { CreateGameSessionDTO } from './dtos/game-session.dto';
import { GameSessionsService } from './sessions/game-sessions.service';
import { GameEngineService } from './game-engine.service';

@Controller('game-engine')
export class GameEngineController {
  constructor(
    private readonly gameEngineService: GameEngineService,
    private readonly gameSessionsService: GameSessionsService,
  ) {}

  // TODO: I'm not sure this is necessary?
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
