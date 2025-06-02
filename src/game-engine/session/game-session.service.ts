import { UUID } from 'node:crypto';
import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import {
  DataSource,
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
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  async findById(id: UUID): Promise<NullableGameSession> {
    return await this.gameSessionRepo.findOneBy({ id });
  }

  async findAllForPlayer(playerID: UUID): Promise<GameSession[]> {
    return await this.gameSessionRepo.find({
      $or: [{ playerOneID: playerID }, { playerTwoID: playerID }],
    });
  }

  async createOne(
    gameSession: CreateGameSessionDTO,
  ): Promise<InsertOneResult<GameSession>> {
    return await this.gameSessionRepo.insertOne(gameSession);
  }

  // TODO: this jsut fails in a different way :']
  async _createOne(
    gameSession: CreateGameSessionDTO,
  ): Promise<InsertOneResult<GameSession> | null> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    console.log(
      '    GameSessionService.createOne    '
        .padStart(100, '=')
        .padEnd(180, '='),
      '\n',
      inspect(
        {
          queryRunner,
          mongoRepo: queryRunner.manager.getMongoRepository(GameSession),
          this: this,
          gameSessionRepo: this.gameSessionRepo,
        },
        { colors: true, depth: 2, showHidden: true },
      ),
      '\n',
      ''.padEnd(180, '='),
    );

    let createdGameSession: InsertOneResult<GameSession> | null = null;

    try {
      console.log(
        '    GameSessionService.createOne - before insertOne    '
          .padStart(140, '-')
          .padEnd(180, '-'),
      );
      createdGameSession =
        // await this.gameSessionRepo.insertOne(gameSession);
        await queryRunner.manager
          .getMongoRepository(GameSession)
          .insertOne(gameSession);
      console.log(
        '    GameSessionService.createOne - before commitTransaction    '
          .padStart(140, '-')
          .padEnd(180, '-'),
      );
      await queryRunner.commitTransaction();
    } catch (error) {
      console.error(
        '[GameSessionService.createOne] Encountered ERROR inserting document',
        error,
      );
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }

    return createdGameSession ?? null;
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
