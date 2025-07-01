import { UUID } from 'node:crypto';
import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';

import { Public } from '@/auth/decorators/public.decorator';
import { CreateGameSessionDTO } from '../dtos/game-session.dto';
import { GameSessionsService } from '../sessions/game-sessions.service';

@Controller('game-sessions')
export class GameSessionsController {
  constructor(private readonly gameSessionsService: GameSessionsService) {}

  // TODO: add decorator for the session cookie
  @Post('start')
  async createNewGameSession(
    @Body() requestData: CreateGameSessionDTO, // force formatting
  ) {
    const dataAsDTO = plainToInstance(CreateGameSessionDTO, requestData);
    const createdGameSession =
      await this.gameSessionsService.createOne(dataAsDTO);
    return {
      session: createdGameSession,
    };
  }

  @Public()
  @Get('history/:playerID')
  async getGameSessionHistory(@Param('playerID') playerID: UUID) {
    const playerSessions =
      await this.gameSessionsService.findAllForPlayer(playerID);
    return {
      sessions: playerSessions,
    };
  }
}
