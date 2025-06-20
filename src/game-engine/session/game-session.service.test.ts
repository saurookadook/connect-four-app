import { randomUUID } from 'node:crypto';
import { Test, TestingModule } from '@nestjs/testing';
import { getConnectionToken } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';

import { mockNow } from '@/__mocks__/commonMocks';
import { mockPlayers } from '@/__mocks__/playerMocks';
import { PlayerModule } from '@/player/player.module';
import { Player } from '@/player/schemas/player.schema';
import {
  GAME_SESSION_MODEL_TOKEN,
  PLAYER_MODEL_TOKEN,
  GameSessionStatus,
} from '@/constants';
import { DatabaseModule } from '@/database/database.module';
import { expectHydratedDocumentToMatch } from '@/utils/testing';
import {
  GameSession,
  GameSessionDocument,
} from '../schemas/game-session.schema';
import { GameSessionModule } from './game-session.module';
import { GameSessionService } from './game-session.service';

const [mockFirstPlayer, mockSecondPlayer, mockThirdPlayer] = mockPlayers;
const mockGameSession = {
  playerOneID: mockFirstPlayer.playerID,
  playerTwoID: mockSecondPlayer.playerID,
  moves: [],
  status: GameSessionStatus.ACTIVE,
  createdAt: mockNow,
  updatedAt: mockNow,
};

describe('GameSessionService', () => {
  let mongoConnection: Connection;
  let playerModel: Model<Player>;
  let service: GameSessionService;
  let model: Model<GameSession>;

  beforeAll(async () => {
    jest.useFakeTimers({
      doNotFake: ['nextTick', 'setImmediate'],
      now: mockNow,
    });
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        DatabaseModule, // force formatting
        GameSessionModule,
        PlayerModule,
      ],
    }).compile();

    mongoConnection = await module.resolve(getConnectionToken());
    playerModel = await module.resolve(PLAYER_MODEL_TOKEN);
    service = await module.resolve(GameSessionService);
    model = await module.resolve(GAME_SESSION_MODEL_TOKEN);
  });

  beforeEach(async () => {
    await model.deleteMany({}).exec();
    await playerModel.deleteMany({}).exec();
    jest.clearAllTimers();
  });

  afterAll(async () => {
    await model.deleteMany({}).exec();
    await playerModel.deleteMany({}).exec();
    await mongoConnection.close();
    jest.useRealTimers();
  });

  describe("'createOne' method", () => {
    beforeEach(async () => {
      jest.setSystemTime(mockNow);
      jest.spyOn(global.Date, 'now').mockReturnValue(mockNow.getTime());

      await playerModel.insertMany([
        mockFirstPlayer,
        mockSecondPlayer,
        mockThirdPlayer,
      ]);
    });

    afterEach(async () => {
      await model.deleteMany({}).exec();
      await playerModel.deleteMany({}).exec();
      jest.clearAllTimers();
    });

    it('should insert a new game session document', async () => {
      const newGameSession = await service.createOne({
        playerOneID: mockFirstPlayer.playerID,
        playerTwoID: mockSecondPlayer.playerID,
      });

      expectHydratedDocumentToMatch<GameSession>(
        newGameSession, // force formatting
        {
          ...mockGameSession,
        },
      );
    });

    it('throws error if player IDs are the same', async () => {
      await expect(
        service.createOne({
          playerOneID: mockFirstPlayer.playerID,
          playerTwoID: mockFirstPlayer.playerID,
        }),
      ).rejects.toThrow();
    });

    it('throws error for invalid player IDs', async () => {
      await expect(
        service.createOne({
          playerOneID: mockFirstPlayer.playerID,
          playerTwoID: mockFirstPlayer.playerID,
        }),
      ).rejects.toThrow();
    });
  });

  describe("'findOneById' method", () => {
    let initialGameSession: GameSessionDocument;

    beforeEach(async () => {
      jest.setSystemTime(mockNow);
      jest.spyOn(global.Date, 'now').mockReturnValue(mockNow.getTime());

      await playerModel.insertMany([
        mockFirstPlayer,
        mockSecondPlayer,
        mockThirdPlayer,
      ]);

      initialGameSession = await service.createOne({
        playerOneID: mockFirstPlayer.playerID,
        playerTwoID: mockSecondPlayer.playerID,
      });
    });

    afterEach(async () => {
      await model.deleteMany({}).exec();
      await playerModel.deleteMany({}).exec();
      jest.clearAllTimers();
    });

    it('should find a game session document by ID', async () => {
      const foundGameSession = (await service.findOneById(
        initialGameSession._id.toString(),
      )) as GameSessionDocument;

      expectHydratedDocumentToMatch<GameSession>(
        foundGameSession, // force formatting
        {
          ...mockGameSession,
        },
      );
    });
  });

  describe("'findAllForPlayer' method", () => {
    beforeEach(async () => {
      jest.setSystemTime(mockNow);
      jest.spyOn(global.Date, 'now').mockReturnValue(mockNow.getTime());

      await playerModel.insertMany([
        mockFirstPlayer,
        mockSecondPlayer,
        mockThirdPlayer,
      ]);
    });

    afterEach(async () => {
      await model.deleteMany({}).exec();
      await playerModel.deleteMany({}).exec();
      jest.clearAllTimers();
    });

    it('should find all game session documents for a player by their ID', async () => {
      const gameSessionOne = await service.createOne({
        playerOneID: mockFirstPlayer.playerID,
        playerTwoID: mockSecondPlayer.playerID,
      });
      const gameSessionTwo = await service.createOne({
        playerOneID: mockThirdPlayer.playerID,
        playerTwoID: mockFirstPlayer.playerID,
      });

      const foundGameSessions = await service.findAllForPlayer(
        mockFirstPlayer.playerID,
      );

      expect(foundGameSessions).toHaveLength(2);

      const [foundGameSessionOne, foundGameSessionTwo] = foundGameSessions;
      expectHydratedDocumentToMatch<GameSession>(foundGameSessionOne, {
        ...mockGameSession,
        _id: gameSessionOne._id,
      });
      expectHydratedDocumentToMatch<GameSession>(foundGameSessionTwo, {
        ...mockGameSession,
        _id: gameSessionTwo._id,
        playerOneID: mockThirdPlayer.playerID,
        playerTwoID: mockFirstPlayer.playerID,
      });
    });
  });

  describe("'updateOne' method", () => {
    let initialGameSession: GameSessionDocument;

    beforeEach(async () => {
      jest.setSystemTime(mockNow);
      jest.spyOn(global.Date, 'now').mockReturnValue(mockNow.getTime());

      await playerModel.insertMany([
        mockFirstPlayer,
        mockSecondPlayer,
        mockThirdPlayer,
      ]);

      initialGameSession = await service.createOne({
        playerOneID: mockFirstPlayer.playerID,
        playerTwoID: mockSecondPlayer.playerID,
      });
    });

    afterEach(async () => {
      await model.deleteMany({}).exec();
      await playerModel.deleteMany({}).exec();
      jest.clearAllTimers();
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
          playerID: mockFirstPlayer.playerID,
          timestamp: new Date(),
        },
        {
          columnIndex: 2,
          playerID: mockSecondPlayer.playerID,
          timestamp: nowPlus30Seconds,
        },
        {
          columnIndex: 3,
          playerID: mockFirstPlayer.playerID,
          timestamp: nowPlus1Minute,
        },
      ];

      const updatedGameSession = (await service.updateOne(
        initialGameSession._id.toString(),
        {
          moves: [...initialGameSession.moves, ...updatedMoves],
        },
      )) as GameSessionDocument;

      expectHydratedDocumentToMatch<GameSession>(
        updatedGameSession, // force formatting
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
      jest.setSystemTime(mockNow);
      jest.spyOn(global.Date, 'now').mockReturnValue(mockNow.getTime());

      await playerModel.insertMany([
        mockFirstPlayer,
        mockSecondPlayer,
        mockThirdPlayer,
      ]);

      initialGameSession = await service.createOne({
        playerOneID: mockFirstPlayer.playerID,
        playerTwoID: mockSecondPlayer.playerID,
      });
    });

    afterEach(async () => {
      await model.deleteMany({}).exec();
      await playerModel.deleteMany({}).exec();
      jest.clearAllTimers();
    });

    it('should delete a game session document', async () => {
      expectHydratedDocumentToMatch<GameSession>(initialGameSession, {
        ...mockGameSession,
      });

      const initialID = initialGameSession._id.toString();
      const deletedGameSession = (await service.deleteOneById(
        initialID,
      )) as GameSessionDocument;

      expectHydratedDocumentToMatch<GameSession>(
        deletedGameSession, // force formatting
        {
          ...mockGameSession,
        },
      );

      const emptyResult = await service.findOneById(initialID);
      expect(emptyResult).toBeNull();
    });
  });
});
