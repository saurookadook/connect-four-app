import { UUID } from 'node:crypto';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Document,
  InsertOneResult,
  MongoRepository,
  ObjectId,
  UpdateResult,
} from 'typeorm';

import {
  CreateGameSessionDTO,
  UpdateGameSessionDTO,
} from '@game-engine/dtos/game-session.dto';
import {
  GameSession,
  NullableGameSession,
} from '@game-engine/session/game-session.entity';
import { inspect } from 'node:util';

@Injectable()
export class GameSessionService {
  constructor(
    @InjectRepository(GameSession)
    private readonly gameSessionRepo: MongoRepository<GameSession>,
  ) {}

  async findById(id: UUID): Promise<NullableGameSession> {
    return await this.gameSessionRepo.findOneBy({ id });
  }

  async createOne(
    gameSession: CreateGameSessionDTO,
  ): Promise<InsertOneResult<GameSession>> {
    console.log(
      '    GameSessionService.createOne    '
        .padStart(100, '=')
        .padEnd(180, '='),
      inspect(
        { this: this, gameSessionRepo: this.gameSessionRepo },
        { colors: true, depth: 2, showHidden: true },
      ),
      ''.padEnd(180, '='),
    );

    const createdGameSession =
      await this.gameSessionRepo.insertOne(gameSession);
    return createdGameSession;
  }

  async updateOne(
    id: string,
    gameSession: UpdateGameSessionDTO,
  ): Promise<Document | UpdateResult> {
    const updatedGameSession = await this.gameSessionRepo.updateOne(
      { id: new ObjectId(id) },
      { $set: gameSession },
      { upsert: true },
    );
    return updatedGameSession;
  }

  async deleteTodo(id: string): Promise<Document | null> {
    return this.gameSessionRepo.findOneAndDelete({ id: new ObjectId(id) });
  }
}
