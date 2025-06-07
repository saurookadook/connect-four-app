import { randomUUID } from 'node:crypto';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { MongooseModule, getConnectionToken } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';
import { Connection, Model } from 'mongoose';

import baseConfig, { buildConnectionURI } from '@/config';
import { GAME_SESSION_MODEL_TOKEN, GameSessionStatus } from '@/constants';
import {
  GameSession,
  GameSessionDocument,
} from '@game-engine/schemas/game-session.schema';
import { GameSessionModule } from '@game-engine/session/game-session.module';
import { GameSessionService } from '@game-engine/session/game-session.service';

const mockFirstPlayerID = randomUUID();
const mockSecondPlayerID = randomUUID();
const mockThirdPlayerID = randomUUID();
const mockNow = new Date();
const mockGameSession = {
  playerOneID: mockFirstPlayerID,
  playerTwoID: mockSecondPlayerID,
  moves: [],
  status: GameSessionStatus.ACTIVE,
  createdAt: mockNow,
  updatedAt: mockNow,
};

describe('GameSessionService', () => {
  let mongoConnection: Connection;
  let service: GameSessionService;
  let model: Model<GameSession>;

  beforeAll(async () => {
    jest.useFakeTimers({
      doNotFake: ['nextTick', 'setImmediate'],
      now: mockNow,
    });
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          envFilePath: '.env.test',
          isGlobal: true,
          load: [baseConfig],
        }),
        MongooseModule.forRootAsync({
          imports: [ConfigModule],
          useFactory: (configService: ConfigService) => {
            return {
              uri: buildConnectionURI(configService),
            };
          },
          inject: [ConfigService],
        }),
        GameSessionModule,
      ],
    }).compile();

    mongoConnection = await module.resolve(getConnectionToken());
    service = await module.resolve(GameSessionService);
    model = await module.resolve(GAME_SESSION_MODEL_TOKEN);
  });

  beforeEach(() => {
    jest.setSystemTime(mockNow);
    jest.spyOn(global.Date, 'now').mockReturnValue(mockNow.getTime());
  });

  afterEach(async () => {
    await model.deleteMany({});
    jest.clearAllTimers();
  });

  afterAll(async () => {
    await model.deleteMany({}).exec();
    await mongoConnection.close();
    jest.useRealTimers();
  });

  it("'createOne' - should insert a new game session document", async () => {
    const newGameSession = await service.createOne({
      playerOneID: mockFirstPlayerID,
      playerTwoID: mockSecondPlayerID,
    });

    expectGameSessionToMatch(newGameSession, {
      ...mockGameSession,
    });
  });

  it("'findById' - should a game session document by ", async () => {
    const newGameSession = await service.createOne({
      playerOneID: mockFirstPlayerID,
      playerTwoID: mockSecondPlayerID,
    });

    const foundGameSession = await service.findOneById(newGameSession._id);

    expectGameSessionToMatch(foundGameSession as GameSessionDocument, {
      ...mockGameSession,
    });
  });

  it("'findAllForPlayer' - should insert a new game session document", async () => {
    const gameSessionOne = await service.createOne({
      playerOneID: mockFirstPlayerID,
      playerTwoID: mockSecondPlayerID,
    });
    const gameSessionTwo = await service.createOne({
      playerOneID: mockThirdPlayerID,
      playerTwoID: mockFirstPlayerID,
    });

    const foundGameSessions = await service.findAllForPlayer(mockFirstPlayerID);

    expect(foundGameSessions).toHaveLength(2);

    const [foundGameSessionOne, foundGameSessionTwo] = foundGameSessions;
    expectGameSessionToMatch(foundGameSessionOne, {
      ...mockGameSession,
      _id: gameSessionOne._id,
    });
    expectGameSessionToMatch(foundGameSessionTwo, {
      ...mockGameSession,
      _id: gameSessionTwo._id,
      playerOneID: mockThirdPlayerID,
      playerTwoID: mockFirstPlayerID,
    });
  });
});

// --------------------------------------------------------------------------------
// Helper Functions (TODO: maybe move to test helpers file?)
// --------------------------------------------------------------------------------
const dateFields = new Set(['createdAt', 'updatedAt']);

function expectGameSessionToMatch(
  gameSessionDocument: GameSessionDocument,
  expected: Partial<GameSession> & { _id?: ObjectId },
): void {
  expect(gameSessionDocument).not.toBeNull();
  expect(gameSessionDocument._id).toEqual(expect.any(ObjectId));
  for (const [key, value] of Object.entries(expected)) {
    if (dateFields.has(key)) {
      expect(gameSessionDocument[key]).toEqual(expect.any(Date));
    } else {
      expect(gameSessionDocument[key]).toEqual(value);
    }
  }
}
