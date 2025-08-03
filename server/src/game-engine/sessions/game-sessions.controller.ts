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
    await createdGameSession.populate(['playerOne', 'playerTwo']);

    const sessionData =
      await this.createSessionDataForResponse(createdGameSession);

    return {
      session: plainToInstance(GameSessionDTO, sessionData),
    };
  }

  @Public()
  @Get('all')
  async getAllGameSessions(): Promise<{ sessions: GameSessionDTO[] }> {
    const gameSessions = await this.gameSessionsService.findAll();
    const transformedSessions =
      await this.createTransformedSessions(gameSessions);

    return {
      sessions: transformedSessions,
    };
  }

  @Public()
  @Get('history/:playerID')
  async getGameSessionsHistoryForPlayerID(
    @Param('playerID') playerID: PlayerID,
  ): Promise<{ sessions: GameSessionDTO[] }> {
    const playerSessions =
      await this.gameSessionsService.findAllForPlayer(playerID);
    const transformedSessions =
      await this.createTransformedSessions(playerSessions);

    return {
      sessions: transformedSessions,
    };
  }

  async createTransformedSessions(
    gameSessions: GameSessionDocument[],
  ): Promise<GameSessionDTO[]> {
    const transformedSessions: GameSessionDTO[] = [];

    for (const session of gameSessions) {
      const sessionData = await this.createSessionDataForResponse(session);

      transformedSessions.push(plainToInstance(GameSessionDTO, sessionData));
    }

    return transformedSessions;
  }

  async createSessionDataForResponse(gameSession: GameSessionDocument) {
    const populatedSession = await gameSession.populate([
      'playerOne',
      'playerTwo',
    ]);
    const { playerOne, playerTwo, ...rest } = populatedSession.toJSON();

    return {
      ...rest,
      playerOneUsername: playerOne.username,
      playerTwoUsername: playerTwo.username,
    };
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

    const sessionData =
      await this.createSessionDataForResponse(foundGameSession);

    return {
      session: plainToInstance(GameSessionDTO, sessionData),
    };
  }
}
