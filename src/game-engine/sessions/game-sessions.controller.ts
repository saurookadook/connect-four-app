import { UUID } from 'node:crypto';
import { Controller, Get, Param } from '@nestjs/common';

import { GameSessionsService } from '@/game-engine/sessions/game-sessions.service';

@Controller('game-sessions')
export class GameSessionsController {
  constructor(private readonly gameSessionsService: GameSessionsService) {}

  @Get('history/:playerID')
  async getGameSessionHistory(@Param('playerID') playerID: UUID) {
    const playerSessions =
      await this.gameSessionsService.findAllForPlayer(playerID);
    return {
      sessions: playerSessions,
    };
  }
}
