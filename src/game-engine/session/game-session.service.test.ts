import { randomUUID } from 'node:crypto';
import { Test, TestingModule } from '@nestjs/testing';
import { getConnectionToken } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';

import { GAME_SESSION_MODEL_TOKEN, GameSessionStatus } from '@/constants';
import { databaseProviders } from '@/database/database.providers';
import { expectHydratedDocumentToMatch } from '@/utils/testing';
import {
  GameSession,
  GameSessionDocument,
} from '../schemas/game-session.schema';
import { GameSessionModule } from './game-session.module';
import { GameSessionService } from './game-session.service';

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
        ...databaseProviders, // force formatting
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
    await model.deleteMany({}).exec();
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

      expectHydratedDocumentToMatch<GameSession>(newGameSession, {
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

    it('should find a game session document by ID', async () => {
      const foundGameSession = await service.findOneById(
        initialGameSession._id.toString(),
      );

      expectHydratedDocumentToMatch<GameSession>(
        foundGameSession as GameSessionDocument,
        {
          ...mockGameSession,
        },
      );
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
      expectHydratedDocumentToMatch<GameSession>(foundGameSessionOne, {
        ...mockGameSession,
        _id: gameSessionOne._id,
      });
      expectHydratedDocumentToMatch<GameSession>(foundGameSessionTwo, {
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
      expectHydratedDocumentToMatch<GameSession>(initialGameSession, {
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

      expectHydratedDocumentToMatch<GameSession>(
        updatedGameSession as GameSessionDocument,
        {
          ...mockGameSession,
          moves: [...mockGameSession.moves, ...updatedMoves],
        },
      );
    });
  });

  describe('deleteOneById', () => {
    let initialGameSession: GameSessionDocument;

    beforeEach(async () => {
      initialGameSession = await service.createOne({
        playerOneID: mockFirstPlayerID,
        playerTwoID: mockSecondPlayerID,
      });
    });

    it('should delete a game session document', async () => {
      expectHydratedDocumentToMatch<GameSession>(initialGameSession, {
        ...mockGameSession,
      });

      const initialID = initialGameSession._id.toString();
      const deletedGameSession = await service.deleteOneById(initialID);

      expectHydratedDocumentToMatch<GameSession>(
        deletedGameSession as GameSessionDocument,
        {
          ...mockGameSession,
        },
      );

      const emptyResult = await service.findOneById(initialID);
      expect(emptyResult).toBeNull();
    });
  });
});
