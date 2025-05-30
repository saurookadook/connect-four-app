import { randomUUID } from 'node:crypto';
import { inspect } from 'node:util';
import { Test, TestingModule } from '@nestjs/testing';
import {
  MongooseModule,
  getConnectionToken,
  getModelToken,
} from '@nestjs/mongoose';
import mongoose, { Connection, Model } from 'mongoose';

import { GameSessionStatus, MONGO_DB_CONNECTION } from '@/constants';
import { DatabaseModule } from '@/database/database.module';
import {
  GameSession,
  GameSessionSchema,
} from '@game-engine/schemas/game-session.schema';
import { GameSessionModule } from '@game-engine/session/game-session.module';
import { gameSessionProvider } from '@game-engine/session/game-session.provider';
import { GameSessionService } from '@game-engine/session/game-session.service';
import { createMockModel } from '@/utils/test-helpers';

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
  let mongoConnection: typeof mongoose;
  let service: GameSessionService;
  // let model: Model<GameSession>;

  beforeAll(async () => {
    jest.useFakeTimers({
      now: mockNow,
    });
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        DatabaseModule,
        // MongooseModule.forRootAsync({
        //   useFactory: () => ({
        //     bufferCommands: false,
        //     dbName: 'test-connect-four',
        //     onConnectionCreate: (connection: Connection) => {
        //       const logPrefix = '[MongoDB Connection] - ';
        //       connection.on('connected', () =>
        //         console.log(logPrefix + 'connected'),
        //       );
        //       connection.on('open', () => console.log(logPrefix + 'open'));
        //       connection.on('error', (error) => {
        //         console.error(logPrefix + 'error', error);
        //       });
        //       connection.on('disconnected', () =>
        //         console.log(logPrefix + 'disconnected'),
        //       );
        //       connection.on('reconnected', () =>
        //         console.log(logPrefix + 'reconnected'),
        //       );
        //       connection.on('disconnecting', () =>
        //         console.log(logPrefix + 'disconnecting'),
        //       );

        //       return connection;
        //     },
        //     uri: 'mongodb://0.0.0.0:27017/test-connect-four',
        //   }),
        // }),
        // GameSessionModule, // force formatting
      ],
      providers: [GameSessionService, gameSessionProvider],
    }).compile();

    mongoConnection = module.get<typeof mongoose>(MONGO_DB_CONNECTION);
    service = module.get<GameSessionService>(GameSessionService);
    // model = module.get<Model<GameSession>>(GAME_SESSION_MODEL_TOKEN);
    console.log(
      '    GameSessionService test - beforeAll    '
        .padStart(100, '=')
        .padEnd(180, '='),
    );
    console.log(
      inspect(
        { mongoConnection },
        { colors: true, depth: 1, showHidden: true },
      ),
      inspect(
        { modelNames: mongoConnection.modelNames, service },
        { colors: true, depth: 3, showHidden: true },
      ),
    );
    console.log(''.padStart(180, '='));
  });

  afterAll(async () => {
    // await mongoConnection.dropDatabase();
    // await mongoConnection.close();
    await mongoConnection.connection.close();
    await mongoConnection.disconnect();
    jest.useRealTimers();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('testing', async () => {
    const connection = mongoConnection.connection;
    const collections = connection.collections;
    const gameSessionsCollection = connection
      .getClient()
      .db()
      .collection('gamesessions');
    console.log('    testing    '.padStart(100, '=').padEnd(180, '='));
    console.log(
      inspect(
        { collections, gameSessionsCollection },
        { colors: true, depth: 2, showHidden: true },
      ),
    );
    console.log(''.padStart(180, '='));
    await gameSessionsCollection.insertOne(mockGameSession);

    const insertedGameSession = await gameSessionsCollection.findOne({
      playerOneID: mockPlayerOneID,
      playerTwoID: mockPlayerTwoID,
    });
    console.log('    testing    '.padStart(100, '=').padEnd(180, '='));
    console.log(
      inspect(
        { insertedGameSession },
        { colors: true, depth: 2, showHidden: true },
      ),
    );
    console.log(''.padStart(180, '='));
    expect(insertedGameSession).toEqual(
      expect.objectContaining({ ...mockGameSession }),
    );
  });

  it.skip('should insert a new game session document', async () => {
    const newGameSession = await service.createOne({
      playerOneID: mockPlayerOneID,
      playerTwoID: mockPlayerTwoID,
    });

    expect(newGameSession).toBeDefined();
    expect(newGameSession.__v).not.toBeNull();
    expect(newGameSession._id).not.toBeNull();
    for (const [key, mockValue] of Object.entries(mockGameSession)) {
      expect(newGameSession[key]).toEqual(mockValue);
    }
  });
});
