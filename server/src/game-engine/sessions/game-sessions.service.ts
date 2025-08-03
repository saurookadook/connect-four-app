import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { type PlayerID } from '@connect-four-app/shared';
import {
  CreateGameSessionDTO, // force formatting
  UpdateGameSessionDTO,
} from '@/game-engine/dtos';
import {
  GameSession, // force formatting
  GameSessionDocument,
  NullableGameSessionDocument,
} from '@/game-engine/schemas';
import { PlayersService } from '@/players/players.service';

@Injectable()
export class GameSessionsService {
  constructor(
    @InjectModel(GameSession.name)
    private readonly gameSessionModel: Model<GameSessionDocument>,
    private readonly playersService: PlayersService,
  ) {}

  async createOne(
    gameSession: CreateGameSessionDTO,
  ): Promise<GameSessionDocument> {
    await this._validatePlayers({
      playerOneID: gameSession.playerOneID,
      playerTwoID: gameSession.playerTwoID,
    });
    const createdGameSession = new this.gameSessionModel(gameSession);
    return createdGameSession.save();
  }

  async findOneById(id: string): Promise<NullableGameSessionDocument> {
    const foundGameSession = await this.gameSessionModel.findById(id).exec();

    return foundGameSession;
  }

  async findAll(): Promise<GameSessionDocument[]> {
    const foundGameSessions = await this.gameSessionModel
      .find({})
      .sort({ updatedAt: -1 });

    return foundGameSessions;
  }

  async findAllForPlayer(playerID: PlayerID): Promise<GameSessionDocument[]> {
    const foundPlayer = await this.playersService.findOneByPlayerID(playerID);

    if (foundPlayer == null) {
      throw new NotFoundException(
        `[GameSessionsService.findAllForPlayer] : Player with playerID '${playerID}' not found`,
      );
    }

    return this.gameSessionModel
      .find({
        $or: [{ playerOneID: playerID }, { playerTwoID: playerID }],
      })
      .exec();
  }

  async updateOne(
    id: string,
    gameSession: UpdateGameSessionDTO,
  ): Promise<NullableGameSessionDocument> {
    const { playerOneObjectID, playerTwoObjectID, ...rest } = gameSession;

    const updatedGameSession = await this.gameSessionModel
      .findByIdAndUpdate(
        id,
        {
          ...rest,
          playerOne: playerOneObjectID,
          playerTwo: playerTwoObjectID,
        },
        { new: true },
      )
      .exec();

    return updatedGameSession;
  }

  async deleteOneById(id: string): Promise<NullableGameSessionDocument> {
    const deletedGameSession = await this.gameSessionModel
      .findByIdAndDelete(id)
      .exec();

    return deletedGameSession;
  }

  async _validatePlayers({
    playerOneID,
    playerTwoID,
  }: {
    playerOneID: PlayerID;
    playerTwoID: PlayerID;
  }): Promise<void> {
    if (playerOneID === playerTwoID) {
      throw new BadRequestException(
        '[GameSessionsService._validatePlayers] : Player IDs must be different.',
      );
    }

    const playerOneExists =
      await this.playersService.findOneByPlayerID(playerOneID);

    if (!playerOneExists) {
      throw new UnauthorizedException(
        `[GameSessionsService._validatePlayers] : Player One with ID '${playerOneID}' does not exist.`,
      );
    }

    const playerTwoExists =
      await this.playersService.findOneByPlayerID(playerTwoID);

    if (!playerTwoExists) {
      throw new UnauthorizedException(
        `[GameSessionsService._validatePlayers] : Player Two with ID '${playerTwoID}' does not exist.`,
      );
    }
  }
}
