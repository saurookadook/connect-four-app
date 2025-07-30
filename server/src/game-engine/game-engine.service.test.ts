import { Test, TestingModule } from '@nestjs/testing';
import { getConnectionToken } from '@nestjs/mongoose';
import { Connection, Model, Types } from 'mongoose';

import {
  BOARD_ROWS,
  GameLogicEngine,
  GameSessionStatus,
  LogicSession,
  moveTuplesByGenerator,
  populateBoardWithMoves,
  populateBoardWithOneMoveTilWin,
  sharedLog,
  type PlayerMove,
} from '@connect-four-app/shared';
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
import { Player } from '@/players/schemas/player.schema';
import { PlayersModule } from '@/players/players.module';
import { expectHydratedDocumentToMatch } from '@/utils/testing';
import { BoardStatesModule } from './board-states/board-states.module';
import { BoardStatesService } from './board-states/board-states.service';
import { GameSessionsService } from './sessions/game-sessions.service';
import { GameEngineModule } from './game-engine.module';
import { GameEngineService } from './game-engine.service';

const [mockFirstPlayer, mockSecondPlayer, mockThirdPlayer] = mockPlayers;

const logger = sharedLog.getLogger('GameEngineService__tests');

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
        PlayersModule,
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

  afterEach(async () => {
    await boardStateModel.deleteMany({}).exec();
    await gameSessionModel.deleteMany({}).exec();
    jest.clearAllTimers();
  });

  afterAll(async () => {
    await boardStateModel.deleteMany({}).exec();
    await gameSessionModel.deleteMany({}).exec();
    await playerModel.deleteMany({}).exec();
    await mongoConnection.close();
    jest.useRealTimers();
  });

  // TODO: add case that creates and populates new board state with moves from game session
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

      const {
        boardState: newBoardState, // force formatting
        gameSession: newGameSession,
      } = await gameEngineService.startGame({
        playerOneID: mockPlayerOneID,
        playerTwoID: mockPlayerTwoID,
      });

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

      const {
        boardState: newBoardState, // force formatting
        gameSession: foundGameSession,
      } = await gameEngineService.startGame({
        gameSessionID: mockGameSessionID,
        playerOneID: mockPlayerOneID,
        playerTwoID: mockPlayerTwoID,
      });

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

      const {
        boardState: foundBoardState, // force formatting
        gameSession: foundGameSession,
      } = await gameEngineService.startGame({
        gameSessionID: mockGameSessionID,
        playerOneID: mockPlayerOneID,
        playerTwoID: mockPlayerTwoID,
      });

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
      await boardStateModel.deleteMany({}).exec();
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

      let result = await gameEngineService.handlePlayerMove({
        ...move,
      });
      let updatedBoardState = result.boardState;
      let updatedGameSession = result.gameSession;

      expect(updatedBoardState.cells[colIndex][rowIndex]).toEqual(
        expectedCells[colIndex][rowIndex],
      );
      expectHydratedDocumentToMatch<BoardState>(
        updatedBoardState, // force formatting
        {
          ...mockBoardStateDocument,
          cells: expectedCells,
        },
      );
      expectHydratedDocumentToMatch<GameSession>(
        updatedGameSession, // force formatting
        {
          ...mockGameSessionDocument,
          moves: sessionMoves,
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

      result = await gameEngineService.handlePlayerMove({
        ...move,
      });
      updatedBoardState = result.boardState;
      updatedGameSession = result.gameSession;

      expect(updatedBoardState.cells[colIndex][rowIndex]).toEqual(
        expectedCells[colIndex][rowIndex],
      );
      expectHydratedDocumentToMatch<BoardState>(
        updatedBoardState, // force formatting
        {
          ...mockBoardStateDocument,
          cells: expectedCells,
        },
      );
      expectHydratedDocumentToMatch<GameSession>(
        updatedGameSession, // force formatting
        {
          ...mockGameSessionDocument,
          moves: sessionMoves,
        },
      );
    });

    it.skip('should prevent move from player who moved last', async () => {
      expect('implement me').toBe(false);
    });

    it('should handle winning move', async () => {
      /* START TEST SETUP */
      let testGameSessionDocument = await gameSessionsService.createOne({
        playerOneID: mockPlayerOneID,
        playerTwoID: mockPlayerTwoID,
      });
      const testGameSessionID = testGameSessionDocument._id.toJSON();

      const moveTuples =
        moveTuplesByGenerator[populateBoardWithOneMoveTilWin.name];
      const playerMovesFromTuples: PlayerMove[] = moveTuples.map(
        (moveTuple) => {
          const [columnIndex, playerID] = moveTuple;
          return {
            columnIndex: columnIndex,
            gameSessionID: testGameSessionID,
            playerID: playerID,
            timestamp: new Date(),
          };
        },
      );

      testGameSessionDocument = (await gameSessionsService.updateOne(
        testGameSessionID,
        {
          moves: playerMovesFromTuples,
        },
      )) as GameSessionDocument;

      let logicSession: LogicSession = new GameLogicEngine().startGame({
        playerOneID: mockPlayerOneID,
        playerTwoID: mockPlayerTwoID,
      });
      logicSession = populateBoardWithMoves({
        logicSessionRef: logicSession,
        moves: moveTuples,
      });

      const testBoardStateDocument = await boardStatesService.createOne({
        gameSessionID: testGameSessionID,
      });
      const populatedBoardState = await boardStatesService.updateOne(
        testBoardStateDocument._id.toJSON(),
        {
          gameSessionID: testGameSessionID,
          cells: logicSession.board.gameBoardState,
        },
      );

      const nowPlus30Seconds = new Date(mockNow.getTime() + 30000);
      const expectedCells = Array.from(logicSession.board.gameBoardState);
      const colIndex = 0;
      const rowIndex = BOARD_ROWS - 4;
      const move = {
        columnIndex: colIndex,
        gameSessionID: testGameSessionID,
        playerID: mockPlayerOneID,
        timestamp: nowPlus30Seconds,
      };
      expectedCells[colIndex][rowIndex].cellState = mockPlayerOneID;
      const expectedMoves = [...testGameSessionDocument.moves, move];
      /* END TEST SETUP */

      const result = await gameEngineService.handlePlayerMove({
        ...move,
      });
      const updatedBoardState = result.boardState;
      const updatedGameSession = result.gameSession;

      expect(updatedBoardState.cells[colIndex][rowIndex].cellState).toEqual(
        mockPlayerOneID,
      );
      expectHydratedDocumentToMatch<BoardState>(
        updatedBoardState, // force formatting
        {
          _id: testBoardStateDocument._id,
          gameSessionID: testBoardStateDocument.gameSessionID,
          cells: expectedCells,
          createdAt: testBoardStateDocument.createdAt,
          updatedAt: testBoardStateDocument.updatedAt,
        },
      );
      expect(updatedGameSession.moves.length).toEqual(expectedMoves.length);
      expectHydratedDocumentToMatch<GameSession>(
        updatedGameSession, // force formatting
        {
          _id: testGameSessionDocument._id,
          playerOneID: testGameSessionDocument.playerOneID,
          playerTwoID: testGameSessionDocument.playerTwoID,
          moves: expectedMoves,
          status: GameSessionStatus.COMPLETED,
          winner: mockPlayerOneID,
          createdAt: testGameSessionDocument.createdAt,
          updatedAt: testGameSessionDocument.updatedAt,
        },
      );
    });
  });
});

// NOTE: for debugging :]
// logicSession.board.gameBoardState.forEach((c, i) => {
//   c.forEach((r, j) => {
//     const pbsCell = populatedBoardState!.cells[i][j];
//     logger.log(
//       '\n',
//       `Value at (c: ${i}, r: ${j})\n`,
//       `==== for 'logicSession' : ${r.cellState}`,
//       `==== for 'populatedBoardState' : ${pbsCell.cellState}`,
//     );
//   });
// });
