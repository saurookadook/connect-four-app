import { randomUUID } from 'node:crypto';
import { inspect } from 'node:util';
import { Module } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';
import { MongooseModule, getConnectionToken } from '@nestjs/mongoose';
// import * as mongoose from 'mongoose';
import { Connection } from 'mongoose';

import {
  GameSessionStatus, // force formatting
  MONGO_CONNECTION_TEST_URL,
} from '@/constants';
import { TestDatabaseModule } from '@/database/test-database.module';
import {
  GameSession,
  GameSessionSchema,
} from '@game-engine/schemas/game-session.schema';
import { GameSessionService } from '@game-engine/session/game-session.service';
// import { AppModule } from '@/app.module';
// import { createMockModel } from '@/utils/test-helpers';

const mockPlayerOneID = randomUUID();
const mockPlayerTwoID = randomUUID();
const mockNow = new Date();
const mockGameSession = {
  playerOneID: mockPlayerOneID,
  playerTwoID: mockPlayerTwoID,
  moves: [],
  status: GameSessionStatus.ACTIVE,
  createdAt: mockNow,
  updatedAt: mockNow,
};

@Module({
  imports: [
    MongooseModule.forRoot(MONGO_CONNECTION_TEST_URL),
    // AppModule,
    MongooseModule.forFeature([
      { name: GameSession.name, schema: GameSessionSchema },
    ]),
    // TestDatabaseModule, // force formatting
  ],
  providers: [
    GameSessionService, // force formatting
  ],
})
export class TestGameSessionModule {}

describe('GameSessionService', () => {
  let module: TestingModule;
  let service: GameSessionService;
  let connection: Connection;
  // let testDatabaseModule: typeof mongoose;
  // let gameSessionModel: Model<GameSession>;

  beforeAll(async () => {
    console.log(
      '    beforeAll - GameSessionService    '
        .padStart(100, '=')
        .padEnd(180, '='),
    );
    console.log({
      mongod: global.mongod,
      mongoConnection: global.mongoConnection,
    });
    // inspect(global.mongod, { colors: true, depth: 2 });
    // inspect(global.mongoConnection, { colors: true, depth: 2 });
    console.log(''.padStart(180, '='));
    // gameSessionModel = (global.mongoConnection as Connection).model(
    //   GameSession.name,
    //   GameSessionSchema,
    // );

    jest.useFakeTimers({
      now: mockNow.getTime(),
    });
    module = await Test.createTestingModule({
      imports: [
        TestDatabaseModule, // force formatting
        // TestGameSessionModule,
        MongooseModule.forFeature([
          { name: GameSession.name, schema: GameSessionSchema },
        ]),
      ],
      providers: [
        GameSessionService, // force formatting
      ],
    }).compile();

    service = module.get(GameSessionService);
    connection = await module.get(getConnectionToken());
    console.log(
      '    end of beforeAll - GameSessionService    '
        .padStart(100, '=')
        .padEnd(180, '='),
    );
    console.log(
      inspect(
        {
          connection,
          // module,
          // service,
        },
        { colors: true, depth: 2 },
      ),
    );
    console.log(''.padStart(180, '='));
  });

  // afterEach(async () => {
  //   const { collections } = global.mongoConnection as Connection;
  //   for (const key in collections) {
  //     await collections[key].deleteMany({});
  //   }
  // });

  afterAll(async () => {
    console.log(
      '    afterAll - GameSessionService    '
        .padStart(100, '=')
        .padEnd(180, '='),
    );
    console.log(
      inspect(
        {
          connection,
          // @ts-expect-error: TODO
          baseConnections: connection!.base!.connections,
          dropDatabase: typeof connection.dropDatabase,
          close: typeof connection.close,
          // module,
          // service,
        },
        { colors: true, depth: 2 },
      ),
    );
    console.log(''.padStart(180, '='));
    // await (global.mongoConnection as Connection).dropDatabase();
    await connection.dropDatabase();
    await connection.close();
    await connection.getClient().close();
    await module.close();
    jest.useRealTimers();
  });

  it('should insert a new game session document', async () => {
    console.log(
      '    in test - GameSessionService    '
        .padStart(100, '=')
        .padEnd(180, '='),
    );
    console.log(
      inspect(
        {
          connection,
          // module,
          // service,
        },
        { colors: true, depth: 2 },
      ),
    );
    console.log(''.padStart(180, '='));
    const newGameSession = await service.createOne({
      playerOneID: mockPlayerOneID,
      playerTwoID: mockPlayerTwoID,
    });

    expect(newGameSession.__v).not.toBeNull();
    expect(newGameSession._id).not.toBeNull();
    for (const [key, value] of Object.entries(mockGameSession)) {
      expect(newGameSession[key]).toEqual(value);
    }
  });
});
