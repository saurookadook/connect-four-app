import { inspect } from 'node:util';
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';

import { sharedLog } from '@connect-four-app/shared';
import { LoggedInGuard } from '@/auth/guards';
import { GameSessionsService } from '@/game-engine/sessions/game-sessions.service';
import {
  BoardStateDTO,
  CreateGameSessionDTO,
  GameSessionDTO,
} from '@/game-engine/dtos';
import { BoardStateDocument, GameSessionDocument } from '@/game-engine/schemas';
import { DTOValidationPipe } from '@/pipes/dto-validation.pipe';
import {
  createTransformedBoardStateDataForResponse,
  createTransformedSessionDataForResponse,
} from '@/utils/transforms';
import { GameEngineService } from './game-engine.service';

const logger = sharedLog.getLogger('GameEngineController');

@Controller('game-engine')
export class GameEngineController {
  constructor(
    private readonly gameEngineService: GameEngineService,
    private readonly gameSessionsService: GameSessionsService,
  ) {}

  @UseGuards(LoggedInGuard)
  @Post('start')
  async startGame(
    @Body(DTOValidationPipe) createGameSessionDTO: CreateGameSessionDTO, // force formatting
  ): Promise<{ boardState: BoardStateDTO; gameSession: GameSessionDTO }> {
    const { boardState: boardStateDocument, gameSession: gameSessionDocument } =
      await this.gameEngineService.startGame({
        playerOneID: createGameSessionDTO.playerOneID,
        playerTwoID: createGameSessionDTO.playerTwoID,
      });

    return {
      boardState: this.createBoardStateDataForResponse(boardStateDocument),
      gameSession: await this.createSessionDataForResponse(gameSessionDocument),
    };
  }

  createBoardStateDataForResponse(boardStateDocument: BoardStateDocument) {
    return createTransformedBoardStateDataForResponse(boardStateDocument);
  }

  async createSessionDataForResponse(gameSessionDocument: GameSessionDocument) {
    return createTransformedSessionDataForResponse(gameSessionDocument);
  }
}
