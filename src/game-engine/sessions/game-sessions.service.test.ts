import { Test, TestingModule } from '@nestjs/testing';
import { getConnectionToken } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';

import { mockNow } from '@/__mocks__/commonMocks';
import { createNewGameSessionDocumentMock } from '@/__mocks__/gameSessionsMocks';
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
import { GameSessionsModule } from './game-sessions.module';
import { GameSessionsService } from './game-sessions.service';

const [mockFirstPlayer, mockSecondPlayer, mockThirdPlayer] = mockPlayers;
const mockGameSession = {
  playerOneID: mockFirstPlayer.playerID,
  playerTwoID: mockSecondPlayer.playerID,
  moves: [],
  status: GameSessionStatus.ACTIVE,
  createdAt: mockNow,
  updatedAt: mockNow,
};

describe('GameSessionsService', () => {
  let mongoConnection: Connection;
  let playerModel: Model<Player>;
  let gameSessionsService: GameSessionsService;
  let gameSessionModel: Model<GameSession>;

  beforeAll(async () => {
    jest.useFakeTimers({
      doNotFake: ['nextTick', 'setImmediate'],
      now: mockNow,
    });
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        DatabaseModule, // force formatting
        GameSessionsModule,
        PlayerModule,
      ],
    }).compile();

    mongoConnection = await module.resolve(getConnectionToken());
    playerModel = await module.resolve(PLAYER_MODEL_TOKEN);
    gameSessionsService = await module.resolve(GameSessionsService);
    gameSessionModel = await module.resolve(GAME_SESSION_MODEL_TOKEN);

    await playerModel.insertMany([
      mockFirstPlayer,
      mockSecondPlayer,
      mockThirdPlayer,
    ]);
  });

  beforeEach(async () => {
    await gameSessionModel.deleteMany({}).exec();
    jest.clearAllTimers();
  });

  afterAll(async () => {
    await gameSessionModel.deleteMany({}).exec();
    await playerModel.deleteMany({}).exec();
    await mongoConnection.close();
    jest.useRealTimers();
  });

  describe("'createOne' method", () => {
    beforeEach(() => {
      jest.setSystemTime(mockNow);
      jest.spyOn(global.Date, 'now').mockReturnValue(mockNow.getTime());
    });

    afterEach(async () => {
      await gameSessionModel.deleteMany({}).exec();
      jest.clearAllTimers();
    });

    it('should insert a new game session document', async () => {
      const newGameSession = await gameSessionsService.createOne({
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
        gameSessionsService.createOne({
          playerOneID: mockFirstPlayer.playerID,
          playerTwoID: mockFirstPlayer.playerID,
        }),
      ).rejects.toThrow();
    });

    it('throws error for invalid player IDs', async () => {
      await expect(
        gameSessionsService.createOne({
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

      initialGameSession = await gameSessionsService.createOne({
        playerOneID: mockFirstPlayer.playerID,
        playerTwoID: mockSecondPlayer.playerID,
      });
    });

    afterEach(async () => {
      await gameSessionModel.deleteMany({}).exec();
      jest.clearAllTimers();
    });

    it('should find a game session document by ID', async () => {
      const foundGameSession = (await gameSessionsService.findOneById(
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

  describe("'findAll' method", () => {
    let gameSessions: GameSessionDocument[];

    beforeEach(async () => {
      gameSessions = await Promise.all([
        gameSessionsService.createOne({
          playerOneID: mockFirstPlayer.playerID,
          playerTwoID: mockSecondPlayer.playerID,
        }),
        gameSessionsService.createOne({
          playerOneID: mockSecondPlayer.playerID,
          playerTwoID: mockFirstPlayer.playerID,
        }),
        gameSessionsService.createOne({
          playerOneID: mockThirdPlayer.playerID,
          playerTwoID: mockSecondPlayer.playerID,
        }),
      ]);
    });

    afterEach(async () => {
      await gameSessionModel.deleteMany({}).exec();
      jest.clearAllTimers();
    });

    it('should find all game session documents', async () => {
      const foundGameSessions = await gameSessionsService.findAll();

      expect(foundGameSessions).toHaveLength(3);

      foundGameSessions.forEach((foundGameSession, index) => {
        const gameSessionAtInverseIndex = gameSessions.at(-1 - index);

        expectHydratedDocumentToMatch(
          foundGameSession,
          createNewGameSessionDocumentMock({
            _id: gameSessionAtInverseIndex!._id,
            __v: gameSessionAtInverseIndex!.__v,
            playerOneID: gameSessionAtInverseIndex!.playerOneID,
            playerTwoID: gameSessionAtInverseIndex!.playerTwoID,
          }),
        );
      });
    });

    it('should return an empty array if no documents exist', async () => {
      await gameSessionModel.deleteMany({}).exec();

      const foundGameSessions = await gameSessionsService.findAll();

      expect(foundGameSessions).toHaveLength(0);
    });
  });

  describe("'findAllForPlayer' method", () => {
    let gameSessions: GameSessionDocument[];

    beforeEach(async () => {
      jest.setSystemTime(mockNow);
      jest.spyOn(global.Date, 'now').mockReturnValue(mockNow.getTime());

      gameSessions = await Promise.all([
        gameSessionsService.createOne({
          playerOneID: mockFirstPlayer.playerID,
          playerTwoID: mockSecondPlayer.playerID,
        }),
        gameSessionsService.createOne({
          playerOneID: mockSecondPlayer.playerID,
          playerTwoID: mockFirstPlayer.playerID,
        }),
        gameSessionsService.createOne({
          playerOneID: mockThirdPlayer.playerID,
          playerTwoID: mockSecondPlayer.playerID,
        }),
      ]);
    });

    afterEach(async () => {
      await gameSessionModel.deleteMany({}).exec();
      jest.clearAllTimers();
    });

    it('should find all game session documents for a player by their ID', async () => {
      const foundGameSessions = await gameSessionsService.findAllForPlayer(
        mockFirstPlayer.playerID,
      );

      expect(foundGameSessions).toHaveLength(2);

      const [foundGameSessionOne, foundGameSessionTwo] = foundGameSessions;
      const [gameSessionOne, gameSessionTwo] = gameSessions;

      expectHydratedDocumentToMatch<GameSession>(
        foundGameSessionOne,
        createNewGameSessionDocumentMock({
          _id: gameSessionOne._id,
          __v: gameSessionOne.__v,
          playerOneID: gameSessionOne.playerOneID,
          playerTwoID: gameSessionOne.playerTwoID,
        }),
      );
      expectHydratedDocumentToMatch<GameSession>(
        foundGameSessionTwo,
        createNewGameSessionDocumentMock({
          _id: gameSessionTwo._id,
          __v: gameSessionTwo.__v,
          playerOneID: gameSessionTwo.playerOneID,
          playerTwoID: gameSessionTwo.playerTwoID,
        }),
      );
    });
  });

  describe("'updateOne' method", () => {
    let initialGameSession: GameSessionDocument;

    beforeEach(async () => {
      jest.setSystemTime(mockNow);
      jest.spyOn(global.Date, 'now').mockReturnValue(mockNow.getTime());

      initialGameSession = await gameSessionsService.createOne({
        playerOneID: mockFirstPlayer.playerID,
        playerTwoID: mockSecondPlayer.playerID,
      });
    });

    afterEach(async () => {
      await gameSessionModel.deleteMany({}).exec();
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

      const updatedGameSession = (await gameSessionsService.updateOne(
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

      initialGameSession = await gameSessionsService.createOne({
        playerOneID: mockFirstPlayer.playerID,
        playerTwoID: mockSecondPlayer.playerID,
      });
    });

    afterEach(async () => {
      await gameSessionModel.deleteMany({}).exec();
      jest.clearAllTimers();
    });

    it('should delete a game session document', async () => {
      expectHydratedDocumentToMatch<GameSession>(initialGameSession, {
        ...mockGameSession,
      });

      const initialID = initialGameSession._id.toString();
      const deletedGameSession = (await gameSessionsService.deleteOneById(
        initialID,
      )) as GameSessionDocument;

      expectHydratedDocumentToMatch<GameSession>(
        deletedGameSession, // force formatting
        {
          ...mockGameSession,
        },
      );

      const emptyResult = await gameSessionsService.findOneById(initialID);
      expect(emptyResult).toBeNull();
    });
  });
});
