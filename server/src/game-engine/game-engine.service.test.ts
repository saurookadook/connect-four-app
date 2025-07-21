import { Test, TestingModule } from '@nestjs/testing';
import { getConnectionToken } from '@nestjs/mongoose';
import { Connection, Model, Types } from 'mongoose';

import { BOARD_ROWS, GameSessionStatus } from '@connect-four-app/shared';
import {
  createBoardStateDocumentMock,
  type BoardStateDocumentMock,
} from '@/__mocks__/boardStatesMocks';
import { mockNow } from '@/__mocks__/commonMocks';
import {
  createNewGameSessionDocumentMock, // force formatting
  type GameSessionDocumentMock,
} from '@/__mocks__/gameSessionsMocks';
import {
  mockPlayers,
  mockPlayerOneID,
  mockPlayerTwoID,
} from '@/__mocks__/playerMocks';
import {
  BOARD_STATE_MODEL_TOKEN,
  GAME_SESSION_MODEL_TOKEN,
  PLAYER_MODEL_TOKEN,
} from '@/constants';
import { DatabaseModule } from '@/database/database.module';
import {
  BoardState,
  BoardStateDocument,
  GameSession,
  GameSessionDocument,
} from '@/game-engine/schemas';
import { Player } from '@/player/schemas/player.schema';
import { PlayerModule } from '@/player/player.module';
import { expectHydratedDocumentToMatch } from '@/utils/testing';
import { BoardStatesModule } from './board-states/board-states.module';
import { BoardStatesService } from './board-states/board-states.service';
import { GameSessionsService } from './sessions/game-sessions.service';
import { GameEngineModule } from './game-engine.module';
import { GameEngineService } from './game-engine.service';

const [mockFirstPlayer, mockSecondPlayer, mockThirdPlayer] = mockPlayers;

describe('GameEngineService', () => {
  let mongoConnection: Connection;
  let boardStateModel: Model<BoardState>;
  let boardStatesService: BoardStatesService;
  let gameEngineService: GameEngineService;
  let gameSessionModel: Model<GameSession>;
  let gameSessionsService: GameSessionsService;
  let playerModel: Model<Player>;

  beforeAll(async () => {
    jest.useFakeTimers({
      doNotFake: ['nextTick', 'setImmediate'],
      now: mockNow,
    });
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        DatabaseModule, // force formatting
        GameEngineModule,
        PlayerModule,
      ],
    }).compile();

    mongoConnection = await module.resolve(getConnectionToken());
    boardStatesService = await module.resolve(BoardStatesService);
    gameEngineService = await module.resolve(GameEngineService);
    gameSessionsService = await module.resolve(GameSessionsService);
    boardStateModel = await module.resolve(BOARD_STATE_MODEL_TOKEN);
    gameSessionModel = await module.resolve(GAME_SESSION_MODEL_TOKEN);
    playerModel = await module.resolve(PLAYER_MODEL_TOKEN);

    await playerModel.insertMany([
      mockFirstPlayer,
      mockSecondPlayer,
      mockThirdPlayer,
    ]);
  });

  afterAll(async () => {
    await boardStateModel.deleteMany({}).exec();
    await gameSessionModel.deleteMany({}).exec();
    await playerModel.deleteMany({}).exec();
    await mongoConnection.close();
    jest.useRealTimers();
  });

  describe("'startGame' method", () => {
    beforeEach(async () => {
      await boardStateModel.deleteMany({}).exec();
      await gameSessionModel.deleteMany({}).exec();
      jest.clearAllTimers();
    });

    it('creates new game session and board state documents', async () => {
      const emptyGameSessionResult = await gameSessionModel
        .findOne({
          playerOneID: mockPlayerOneID,
          playerTwoID: mockPlayerTwoID,
        })
        .exec();
      expect(emptyGameSessionResult).toBeNull();

      const emptyBoardStateResult = await boardStateModel.find({}).exec();
      expect(emptyBoardStateResult).toEqual([]);

      const newGameSession = await gameEngineService.startGame({
        playerOneID: mockPlayerOneID,
        playerTwoID: mockPlayerTwoID,
      });
      const newBoardState = (await boardStatesService.findOneByGameSessionID(
        newGameSession.id,
      )) as BoardStateDocument;

      const mockGameSessionDocument = createNewGameSessionDocumentMock({
        playerOneID: mockPlayerOneID,
        playerTwoID: mockPlayerTwoID,
      });
      const mockBoardStateDocument = createBoardStateDocumentMock(
        newGameSession.id,
      );

      expectHydratedDocumentToMatch<BoardState>(
        newBoardState, // force formatting
        {
          ...mockBoardStateDocument,
        },
      );
      expectHydratedDocumentToMatch<GameSession>(
        newGameSession, // force formatting
        {
          ...mockGameSessionDocument,
        },
      );
    });

    it('finds existing game session document and creates new board state document', async () => {
      const initialGameSessionDocument = await gameSessionsService.createOne({
        playerOneID: mockFirstPlayer.playerID,
        playerTwoID: mockSecondPlayer.playerID,
      });
      const mockGameSessionDocument = createNewGameSessionDocumentMock({
        playerOneID: mockPlayerOneID,
        playerTwoID: mockPlayerTwoID,
      });

      const initialGameSessionResult = (await gameSessionModel
        .findById(initialGameSessionDocument.id)
        .exec()) as GameSessionDocument;
      expect(initialGameSessionResult).not.toBeNull();
      expectHydratedDocumentToMatch<GameSession>(
        initialGameSessionResult, // force formatting
        {
          ...mockGameSessionDocument,
        },
      );

      const emptyBoardStateResult = await boardStateModel.find({}).exec();
      expect(emptyBoardStateResult).toEqual([]);

      const mockGameSessionID = initialGameSessionDocument._id.toJSON();
      const mockBoardStateDocument =
        createBoardStateDocumentMock(mockGameSessionID);

      const foundGameSession = await gameEngineService.startGame({
        gameSessionID: mockGameSessionID,
        playerOneID: mockPlayerOneID,
        playerTwoID: mockPlayerTwoID,
      });

      const newBoardState = (await boardStatesService.findOneByGameSessionID(
        foundGameSession.id,
      )) as BoardStateDocument;

      expectHydratedDocumentToMatch<BoardState>(
        newBoardState, // force formatting
        {
          ...mockBoardStateDocument,
        },
      );
      expectHydratedDocumentToMatch<GameSession>(
        foundGameSession, // force formatting
        {
          ...mockGameSessionDocument,
        },
      );
    });

    it('finds existing game session and board state documents', async () => {
      const initialGameSessionDocument = await gameSessionsService.createOne({
        playerOneID: mockFirstPlayer.playerID,
        playerTwoID: mockSecondPlayer.playerID,
      });
      const mockGameSessionID = initialGameSessionDocument._id.toJSON();
      const initialBoardStateDocument = await boardStatesService.createOne({
        gameSessionID: mockGameSessionID,
      });

      const mockGameSessionDocument = createNewGameSessionDocumentMock({
        playerOneID: mockPlayerOneID,
        playerTwoID: mockPlayerTwoID,
      });
      const mockBoardStateDocument =
        createBoardStateDocumentMock(mockGameSessionID);

      const initialGameSessionResult = (await gameSessionModel
        .findOne({
          playerOneID: mockPlayerOneID,
          playerTwoID: mockPlayerTwoID,
        })
        .exec()) as GameSessionDocument;
      expect(initialGameSessionResult).not.toBeNull();
      expectHydratedDocumentToMatch<GameSession>(
        initialGameSessionResult, // force formatting
        {
          ...mockGameSessionDocument,
        },
      );

      const initialBoardStateResult = (await boardStateModel
        .findById(initialBoardStateDocument.id)
        .exec()) as BoardStateDocument;
      expect(initialBoardStateResult).not.toBeNull();
      expectHydratedDocumentToMatch<BoardState>(
        initialBoardStateResult, // force formatting
        {
          ...mockBoardStateDocument,
        },
      );

      const foundGameSession = await gameEngineService.startGame({
        gameSessionID: mockGameSessionID,
        playerOneID: mockPlayerOneID,
        playerTwoID: mockPlayerTwoID,
      });
      const foundBoardState = (await boardStatesService.findOneByGameSessionID(
        foundGameSession.id,
      )) as BoardStateDocument;

      expectHydratedDocumentToMatch<GameSession>(
        foundGameSession, // force formatting
        {
          ...mockGameSessionDocument,
        },
      );
      expectHydratedDocumentToMatch<BoardState>(
        foundBoardState, // force formatting
        {
          ...mockBoardStateDocument,
        },
      );
    });
  });

  describe("'handlePlayerMove' method", () => {
    let initialGameSessionDocument: GameSessionDocument;
    let initialBoardStateDocument: BoardStateDocument;
    let mockGameSessionID: string;
    let mockGameSessionDocument: GameSessionDocumentMock;
    let mockBoardStateDocument: BoardStateDocumentMock;

    beforeEach(async () => {
      jest.setSystemTime(mockNow);
      jest.spyOn(global.Date, 'now').mockReturnValue(mockNow.getTime());

      initialGameSessionDocument = await gameSessionsService.createOne({
        playerOneID: mockFirstPlayer.playerID,
        playerTwoID: mockSecondPlayer.playerID,
      });
      mockGameSessionID = initialGameSessionDocument._id.toJSON();
      initialBoardStateDocument = await boardStatesService.createOne({
        gameSessionID: mockGameSessionID,
      });
      mockGameSessionDocument = createNewGameSessionDocumentMock({
        _id: initialGameSessionDocument._id,
        playerOneID: mockPlayerOneID,
        playerTwoID: mockPlayerTwoID,
      });
      mockBoardStateDocument = createBoardStateDocumentMock(mockGameSessionID);
    });

    afterEach(async () => {
      await gameSessionModel.deleteMany({}).exec();
      jest.clearAllTimers();
    });

    it('should update game session and board state documents', async () => {
      const nowPlus30Seconds = new Date(mockNow.getTime() + 30000);
      const nowPlus1Minute = new Date(mockNow.getTime() + 60000);

      const expectedCells = Array.from(initialBoardStateDocument.cells);
      const colIndex = 2;
      let rowIndex = BOARD_ROWS - 1;
      let move = {
        columnIndex: colIndex,
        gameSessionID: mockGameSessionID,
        playerID: mockPlayerOneID,
        timestamp: nowPlus30Seconds,
      };
      const sessionMoves = [...mockGameSessionDocument.moves, move];
      expectedCells[colIndex][rowIndex].cellState = mockPlayerOneID;

      let updatedGameSession = await gameEngineService.handlePlayerMove({
        ...move,
      });

      let updatedBoardState = (await boardStatesService.findOneByGameSessionID(
        mockGameSessionID,
      )) as BoardStateDocument;

      expect(updatedBoardState.cells[colIndex][rowIndex]).toEqual(
        expectedCells[colIndex][rowIndex],
      );
      expectHydratedDocumentToMatch<BoardState>(
        updatedBoardState, // force formatting
        {
          ...mockBoardStateDocument,
          cells: expectedCells,
          __v: mockBoardStateDocument.__v + 1,
        },
      );
      expectHydratedDocumentToMatch<GameSession>(
        updatedGameSession, // force formatting
        {
          ...mockGameSessionDocument,
          moves: sessionMoves,
          __v: mockGameSessionDocument.__v + 1,
        },
      );

      rowIndex -= 1;
      move = {
        columnIndex: colIndex,
        gameSessionID: mockGameSessionID,
        playerID: mockPlayerTwoID,
        timestamp: nowPlus1Minute,
      };
      sessionMoves.push(move);
      expectedCells[colIndex][rowIndex].cellState = mockPlayerTwoID;

      updatedGameSession = await gameEngineService.handlePlayerMove({
        ...move,
      });

      updatedBoardState = (await boardStatesService.findOneByGameSessionID(
        mockGameSessionID,
      )) as BoardStateDocument;

      expect(updatedBoardState.cells[colIndex][rowIndex]).toEqual(
        expectedCells[colIndex][rowIndex],
      );
      expectHydratedDocumentToMatch<BoardState>(
        updatedBoardState, // force formatting
        {
          ...mockBoardStateDocument,
          cells: expectedCells,
          __v: mockBoardStateDocument.__v + 2,
        },
      );
      expectHydratedDocumentToMatch<GameSession>(
        updatedGameSession, // force formatting
        {
          ...mockGameSessionDocument,
          moves: sessionMoves,
          __v: mockGameSessionDocument.__v + 2,
        },
      );
    });
  });
});
