import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';

import { type PlayerID } from '@connect-four-app/shared';
import { Public } from '@/auth/decorators/public.decorator';
import { CreateGameSessionDTO, GameSessionDTO } from '../dtos/game-session.dto';
import { GameSessionDocument } from '../schemas/game-session.schema';
import { GameSessionsService } from '../sessions/game-sessions.service';

@Controller('game-sessions')
export class GameSessionsController {
  constructor(private readonly gameSessionsService: GameSessionsService) {}

  // TODO: add decorator for the session cookie
  @Post('start')
  async createNewGameSession(
    @Body() requestData: CreateGameSessionDTO, // force formatting
  ): Promise<{ session: GameSessionDTO }> {
    const dataAsDTO = plainToInstance(CreateGameSessionDTO, requestData);
    const createdGameSession =
      await this.gameSessionsService.createOne(dataAsDTO);

    return {
      session: plainToInstance(GameSessionDTO, createdGameSession.toJSON()),
    };
  }

  @Public()
  @Get('all')
  async getAllGameSessions(): Promise<{ sessions: GameSessionDTO[] }> {
    const gameSessions = await this.gameSessionsService.findAll();

    return {
      sessions: this.createTransformedSessions(gameSessions),
    };
  }

  @Public()
  @Get('history/:playerID')
  async getGameSessionsHistoryForPlayerID(
    @Param('playerID') playerID: PlayerID,
  ): Promise<{ sessions: GameSessionDTO[] }> {
    const playerSessions =
      await this.gameSessionsService.findAllForPlayer(playerID);

    return {
      sessions: this.createTransformedSessions(playerSessions),
    };
  }

  createTransformedSessions(
    gameSessions: GameSessionDocument[],
  ): GameSessionDTO[] {
    const transformedSessions = gameSessions.map((session) =>
      plainToInstance(GameSessionDTO, session.toJSON()),
    );

    return transformedSessions;
  }

  @Public()
  @Get(':sessionID')
  async getGameSession(
    @Param('sessionID') sessionID: string,
  ): Promise<{ session: GameSessionDTO }> {
    const foundGameSession =
      await this.gameSessionsService.findOneById(sessionID);

    if (foundGameSession == null) {
      throw new NotFoundException(
        `[GameSessionsController.getGameSession] : Could not find 'game-session' with ID '${sessionID}'.`,
      );
    }

    return {
      session: plainToInstance(GameSessionDTO, foundGameSession.toJSON()),
    };
  }
}
