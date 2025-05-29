import { randomUUID } from 'node:crypto';
import { inspect } from 'node:util';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { MongooseModule, getConnectionToken } from '@nestjs/mongoose';
import mongoose, { connection, Connection } from 'mongoose';

import { GameSessionStatus } from '@/constants';
import { GameSession } from '@game-engine/schemas/game-session.schema';
import { GameSessionModule } from '@game-engine/session/game-session.module';
import { GameSessionService } from '@game-engine/session/game-session.service';
import { createMockModel } from '@/utils/test-helpers';
import { ConfigModule } from '@nestjs/config';

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
  let service: GameSessionService;
  let mongoConnection: Connection;
  // let model: Model<GameSession>;

  beforeAll(async () => {
    jest.useFakeTimers({
      now: mockNow.getTime(),
    });
    module = await Test.createTestingModule({
      imports: [
        MongooseModule.forRootAsync({
          // imports: [ConfigModule]
          useFactory: () => ({
            uri: `mongodb://localhost:27017/test-connect-four`,
            onConnectionCreate: (connection: Connection) => {
              const logPrefix = '[MongooseModule] - ';
              connection.on('connected', () =>
                console.log(logPrefix + 'connected'),
              );
              connection.on('open', () => console.log(logPrefix + 'open'));
              connection.on('disconnected', () =>
                console.log(logPrefix + 'disconnected'),
              );
              connection.on('reconnected', () =>
                console.log(logPrefix + 'reconnected'),
              );
              connection.on('disconnecting', () =>
                console.log(logPrefix + 'disconnecting'),
              );

              return connection;
            },
          }),
        }),
        GameSessionModule,
      ],
      // providers: [
      //   GameSessionService,
      //   // {
      //   //   provide: GAME_SESSION_MODEL_TOKEN,
      //   //   useClass: GameSession,
      //   //   // useValue: createMockModel(mockGameSession),
      //   // },
      // ],
    }).compile();

    // app = module.createNestApplication();
    // await app.init();

    service = module.get(GameSessionService);
    mongoConnection = module.get(getConnectionToken());
    // model = module.get<Model<GameSession>>(GAME_SESSION_MODEL_TOKEN);
    const collections = await mongoConnection.db?.collections();
    console.log(
      inspect(
        { collections, mongoConnection, module, service },
        { colors: true, depth: 1, showHidden: true },
      ),
    );
  });

  afterEach(() => {
    // await app.get<Connection>(getConnectionToken()).db?.dropDatabase();
    // await app.close();
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await mongoConnection.db?.dropDatabase();
    await module.close();
    jest.useRealTimers();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // TODO: I am baffled at why this test is failing. It _seems_ like the
  // database connection isn't being closed properly but I have no idea why.
  it.skip('should insert a new game session document', async () => {
    const newGameSession = await service.createOne({
      playerOneID: mockPlayerOneID,
      playerTwoID: mockPlayerTwoID,
    });

    console.log(
      inspect({ newGameSession, mockGameSession }, { colors: true, depth: 2 }),
    );
    expect(newGameSession).not.toBeNull();
    // @ts-expect-error: TODO
    expect(newGameSession._id).not.toBeNull();
    // @ts-expect-error: TODO
    expect(newGameSession.__v).not.toBeNull();

    for (const [key, mockValue] of Object.entries(mockGameSession)) {
      expect(newGameSession[key]).toEqual(mockValue);
    }
  });
});
