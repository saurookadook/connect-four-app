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

  describe("'createOne' method", () => {
    it('should insert a new game session document', async () => {
      const newGameSession = await service.createOne({
        playerOneID: mockFirstPlayerID,
        playerTwoID: mockSecondPlayerID,
      });

      expectGameSessionToMatch(newGameSession, {
        ...mockGameSession,
      });
    });
  });

  describe("'findOneById' method", () => {
    let initialGameSession: GameSessionDocument;

    beforeEach(async () => {
      initialGameSession = await service.createOne({
        playerOneID: mockFirstPlayerID,
        playerTwoID: mockSecondPlayerID,
      });
    });

    it("'findById' - should find a game session document by ID", async () => {
      const foundGameSession = await service.findOneById(
        initialGameSession._id.toString(),
      );

      expectGameSessionToMatch(foundGameSession as GameSessionDocument, {
        ...mockGameSession,
      });
    });
  });

  describe("'findAllForPlayer' method", () => {
    it('should find all game session documents for a player by their ID', async () => {
      const gameSessionOne = await service.createOne({
        playerOneID: mockFirstPlayerID,
        playerTwoID: mockSecondPlayerID,
      });
      const gameSessionTwo = await service.createOne({
        playerOneID: mockThirdPlayerID,
        playerTwoID: mockFirstPlayerID,
      });

      const foundGameSessions =
        await service.findAllForPlayer(mockFirstPlayerID);

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

  describe("'updateOne' method", () => {
    let initialGameSession: GameSessionDocument;

    beforeEach(async () => {
      initialGameSession = await service.createOne({
        playerOneID: mockFirstPlayerID,
        playerTwoID: mockSecondPlayerID,
      });
    });

    it('should update a game session document', async () => {
      expectGameSessionToMatch(initialGameSession, {
        ...mockGameSession,
      });

      const nowPlus30Seconds = new Date(mockNow.getTime() + 30000);
      const nowPlus1Minute = new Date(mockNow.getTime() + 60000);

      const updatedMoves = [
        {
          columnIndex: 3,
          playerID: mockFirstPlayerID,
          timestamp: new Date(),
        },
        {
          columnIndex: 2,
          playerID: mockSecondPlayerID,
          timestamp: nowPlus30Seconds,
        },
        {
          columnIndex: 3,
          playerID: mockFirstPlayerID,
          timestamp: nowPlus1Minute,
        },
      ];

      const updatedGameSession = await service.updateOne(
        initialGameSession._id.toString(),
        {
          moves: [...initialGameSession.moves, ...updatedMoves],
        },
      );

      expectGameSessionToMatch(updatedGameSession as GameSessionDocument, {
        ...mockGameSession,
        moves: [...mockGameSession.moves, ...updatedMoves],
      });
    });
  });

  describe('deleteOne', () => {
    let initialGameSession: GameSessionDocument;

    beforeEach(async () => {
      initialGameSession = await service.createOne({
        playerOneID: mockFirstPlayerID,
        playerTwoID: mockSecondPlayerID,
      });
    });

    it('should delete a game session document', () => {
      expectGameSessionToMatch(initialGameSession, {
        ...mockGameSession,
      });
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
