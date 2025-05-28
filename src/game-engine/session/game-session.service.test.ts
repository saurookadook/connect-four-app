import { randomUUID } from 'node:crypto';
// import { inspect } from 'node:util';
import { Test, TestingModule } from '@nestjs/testing';
import * as mongoose from 'mongoose';
import { Connection, Model } from 'mongoose';

import {
  MONGO_CONNECTION_TEST_TOKEN,
  GAME_SESSION_MODEL_TOKEN,
  GameSessionStatus,
} from '@/constants';
import {
  GameSession,
  GameSessionSchema,
} from '@game-engine/schemas/game-session.schema';
import { GameSessionService } from '@game-engine/session/game-session.service';
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

describe('GameSessionService', () => {
  let module: TestingModule;
  let testDatabaseModule: typeof mongoose;
  let service: GameSessionService;
  let gameSessionModel: Model<GameSession>;

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
    gameSessionModel = (global.mongoConnection as Connection).model(
      GameSession.name,
      GameSessionSchema,
    );

    jest.useFakeTimers({
      now: mockNow.getTime(),
    });
    module = await Test.createTestingModule({
      providers: [
        GameSessionService, // force formatting
        {
          provide: GAME_SESSION_MODEL_TOKEN,
          useValue: gameSessionModel,
        },
        // testDatabaseProvider,
        // {
        //   provide: GAME_SESSION_MODEL_TOKEN,
        //   useFactory: (connection: Connection) => {
        //     mongoConn = connection;
        //     return connection.model(GameSession.name, GameSessionSchema);
        //   },
        //   inject: [MONGO_CONNECTION_TEST_TOKEN],
        // },
      ],
    }).compile();

    service = module.get(GameSessionService);
  });

  afterEach(async () => {
    const { collections } = global.mongoConnection as Connection;
    for (const key in collections) {
      await collections[key].deleteMany({});
    }
  });

  // afterAll(async () => {
  //   await (global.mongoConnection as Connection).dropDatabase();
  // });

  it('should insert a new game session document', async () => {
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
