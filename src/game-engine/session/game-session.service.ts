import { UUID } from 'node:crypto';
import { inspect } from 'node:util';
import { Injectable } from '@nestjs/common';
import { InjectModel, InjectConnection } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';

import {
  CreateGameSessionDTO,
  UpdateGameSessionDTO,
} from '@game-engine/dtos/game-session.dto';
import {
  GameSession,
  GameSessionDocument,
  NullableGameSessionDocument,
} from '@game-engine/schemas/game-session.schema';

@Injectable()
export class GameSessionService {
  constructor(
    @InjectModel(GameSession.name)
    private readonly gameSessionModel: Model<GameSessionDocument>,
    @InjectConnection() private readonly connection: Connection,
  ) {}

  async findById(id: UUID): Promise<NullableGameSessionDocument> {
    return await this.gameSessionModel.findById(id).exec();
  }

  async createOne(
    gameSession: CreateGameSessionDTO,
  ): Promise<GameSessionDocument[]> {
    console.log(
      inspect({ gameSession }, { colors: true, depth: 4, showHidden: true }),
    );
    return await this.gameSessionModel.insertMany([gameSession]);
  }

  async _createOne(
    gameSession: CreateGameSessionDTO,
  ): Promise<GameSessionDocument> {
    const session = await this.connection.startSession();
    let createdGameSession: GameSessionDocument;

    try {
      console.log(
        inspect(
          { gameSessionModel: this.gameSessionModel },
          { colors: true, depth: 4, showHidden: true },
        ),
      );
      createdGameSession = await this.gameSessionModel.create(gameSession);
      console.log(
        inspect(
          { createdGameSession },
          { colors: true, depth: 4, showHidden: true },
        ),
      );
      await createdGameSession.save();

      await session.commitTransaction();
    } catch (error) {
      console.error('ERROR in GameSessionService.createOne:', error);
      await session.abortTransaction();
    } finally {
      await session.endSession();
    }

    // @ts-expect-error: TODO
    return createdGameSession;
  }

  async updateOne(
    id: string,
    gameSession: UpdateGameSessionDTO,
  ): Promise<NullableGameSessionDocument> {
    return this.gameSessionModel
      .findByIdAndUpdate(id, gameSession, { new: true })
      .exec();
  }

  async deleteTodo(id: string): Promise<NullableGameSessionDocument> {
    return this.gameSessionModel.findByIdAndDelete(id).exec();
  }
}
