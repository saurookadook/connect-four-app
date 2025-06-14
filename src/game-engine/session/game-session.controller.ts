import { UUID } from 'node:crypto';
import { Controller, Get, Param } from '@nestjs/common';

import { GameSessionService } from '@game-engine/session/game-session.service';

@Controller('game-session')
export class GameSessionController {
  constructor(private readonly gameSessionService: GameSessionService) {}

  @Get('history/:playerID')
  async getGameSessionHistory(@Param('playerID') playerID: UUID) {
    // return this.gameSessionService.findAllForPlayer(playerID);
  }
}
