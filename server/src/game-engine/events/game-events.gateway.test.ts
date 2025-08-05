/* eslint-disable @typescript-eslint/unbound-method */
import { getConnectionToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Connection, Model, Types } from 'mongoose';
import ws from 'ws';
import WSMock from 'jest-websocket-mock';

import {
  BOARD_ROWS,
  SEND_MOVE,
  LogicSession,
  GameLogicEngine,
  GameSessionStatus,
  moveTuplesByGenerator,
  populateBoardWithMoves,
  populateBoardWithOneMoveTilWin,
  type PlayerMove,
} from '@connect-four-app/shared';
import { createBoardStateDocumentMock } from '@/__mocks__/boardStatesMocks';
import { createNewGameSessionDocumentMock } from '@/__mocks__/gameSessionsMocks';
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
import { databaseProviders } from '@/database/database.providers';
import { BoardStatesService } from '@/game-engine/board-states/board-states.service';
import {
  BoardState,
  BoardStateDocument,
  GameSession,
  GameSessionDocument,
} from '@/game-engine/schemas';
import { GameSessionsService } from '@/game-engine/sessions/game-sessions.service';
import { GameEngineModule } from '@/game-engine/game-engine.module';
import { Player } from '@/players/schemas/player.schema';
import { PlayersService } from '@/players/players.service';
import { GameEventsGateway, type GameSessionMap } from './game-events.gateway';

const mockThirdPlayer = mockPlayers[2];

describe('GameEventsGateway', () => {
  const mockGameSession = createNewGameSessionDocumentMock({
    _id: new Types.ObjectId(),
    playerOneID: mockPlayerOneID,
    playerTwoID: mockPlayerTwoID,
  });
  const mockGameSessionID = mockGameSession._id!.toString();
  const mockBoardStateDocument =
    createBoardStateDocumentMock(mockGameSessionID);

  let mongoConnection: Connection;
  let boardStateModel: Model<BoardState>;
  let boardStatesService: BoardStatesService;
  let gameSessionModel: Model<GameSession>;
  let gameSessionsService: GameSessionsService;
  let playerModel: Model<Player>;
  let playersService: PlayersService;
  let gateway: GameEventsGateway;
  let activeGameSession: GameSessionMap;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ...databaseProviders, // force formatting
        GameEngineModule,
      ],
      providers: [GameEventsGateway],
    }).compile();

    mongoConnection = await module.resolve(getConnectionToken());
    playersService = await module.resolve(PlayersService);
    await Promise.all(
      mockPlayers.map((player) => playersService.createOne({ ...player })),
    );

    gameSessionsService = await module.resolve(GameSessionsService);
    await gameSessionsService.createOne(mockGameSession);

    boardStatesService = await module.resolve(BoardStatesService);
    await boardStatesService.createOne({
      ...mockBoardStateDocument,
      gameSessionID: mockBoardStateDocument.gameSessionID.toJSON(),
    });

    boardStateModel = await module.resolve(BOARD_STATE_MODEL_TOKEN);
    gameSessionModel = await module.resolve(GAME_SESSION_MODEL_TOKEN);
    playerModel = await module.resolve(PLAYER_MODEL_TOKEN);

    gateway = await module.resolve(GameEventsGateway);
    // @ts-expect-error: Not sure why these types don't line up better?
    gateway.server = new WSMock(`ws://localhost:8090`).server;

    const activeGamesMap = gateway.activeGamesMap;
    activeGamesMap.set(mockGameSessionID, new Map());
    activeGameSession = activeGamesMap.get(mockGameSessionID) as GameSessionMap;
    const mockWebSocketClient = jest.fn(() => {
      return {
        send: jest.fn((...args) => args),
      };
    });

    [mockPlayerOneID, mockPlayerTwoID, mockThirdPlayer.playerID].forEach(
      (playerID) => {
        activeGameSession?.set(
          playerID,
          // @ts-expect-error: Until I can figure out a better way to mock the client
          mockWebSocketClient(),
        );
      },
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await boardStateModel.deleteMany({}).exec();
    await gameSessionModel.deleteMany({}).exec();
    await playerModel.deleteMany({}).exec();
    await mongoConnection.close();
  });

  describe("'onStartGame' method", () => {
    it.skip('should start game and broadcast results to appropriate clients', async () => {
      // TODO: implement this :]
    });
  });

  describe("'onMakeMove' method", () => {
    it('should handle the given move and broadcast results of updated data to appropriate clients', async () => {
      const firstTimestamp = new Date();
      const secondTimestamp = new Date(firstTimestamp.getTime() + 2000);

      const testGameSessionDocument = (await gameSessionsService.findOneById(
        mockGameSessionID,
      )) as GameSessionDocument;
      const testGameSessionID = testGameSessionDocument._id.toJSON();
      const { playerOne: testPlayerOne, playerTwo: testPlayerTwo } =
        testGameSessionDocument;

      const testBoardStateDocument =
        (await boardStatesService.findOneByGameSessionID(
          testGameSessionID,
        )) as BoardStateDocument;

      const firstMakeMoveEvent = {
        columnIndex: 1,
        gameSessionID: testGameSessionID,
        playerID: testPlayerOne.playerID,
        timestamp: firstTimestamp,
      };

      await gateway.onMakeMove(firstMakeMoveEvent);

      let targetRowIndex = BOARD_ROWS - 1;
      let updatedCells = testBoardStateDocument.cells;
      updatedCells[1][targetRowIndex].cellState = testPlayerOne.playerID;

      const firstSendMoveEvent = {
        event: SEND_MOVE,
        data: {
          id: testGameSessionID,
          boardCells: updatedCells,
          moves: [
            ...testGameSessionDocument.moves, // force formatting
            firstMakeMoveEvent,
          ],
          playerOneID: testPlayerOne.playerID,
          playerOneUsername: testPlayerOne.username,
          playerTwoID: testPlayerTwo.playerID,
          playerTwoUsername: testPlayerTwo.username,
          status: testGameSessionDocument.status,
          winner: null,
        },
      };

      expect(
        // @ts-expect-error: Until I can figure out a better way to mock the client
        activeGameSession?.get(testPlayerOne.playerID).send,
      ).toHaveBeenNthCalledWith(1, JSON.stringify(firstSendMoveEvent));
      expect(
        // @ts-expect-error: Until I can figure out a better way to mock the client
        activeGameSession?.get(testPlayerTwo.playerID).send,
      ).toHaveBeenNthCalledWith(1, JSON.stringify(firstSendMoveEvent));

      const secondMakeMoveEvent = {
        ...firstMakeMoveEvent,
        playerID: testPlayerTwo.playerID,
        timestamp: secondTimestamp,
      };

      await gateway.onMakeMove(secondMakeMoveEvent);

      targetRowIndex -= 1;
      updatedCells = testBoardStateDocument.cells;
      updatedCells[1][targetRowIndex].cellState = testPlayerTwo.playerID;

      const secondSendMoveEvent = {
        event: SEND_MOVE,
        data: {
          ...firstSendMoveEvent.data,
          boardCells: updatedCells,
          moves: [
            ...testGameSessionDocument.moves, // force formatting
            firstMakeMoveEvent,
            secondMakeMoveEvent,
          ],
        },
      };

      expect(
        // @ts-expect-error: Until I can figure out a better way to mock the client
        activeGameSession?.get(testPlayerOne.playerID).send,
      ).toHaveBeenNthCalledWith(2, JSON.stringify(secondSendMoveEvent));
      expect(
        // @ts-expect-error: Until I can figure out a better way to mock the client
        activeGameSession?.get(testPlayerTwo.playerID).send,
      ).toHaveBeenNthCalledWith(2, JSON.stringify(secondSendMoveEvent));
    });

    it('should handle a winning move and broadcast results of updated data to appropriate clients', async () => {
      /* START TEST SETUP */
      const moveTuples =
        moveTuplesByGenerator[populateBoardWithOneMoveTilWin.name];
      const playerMovesFromTuples: PlayerMove[] = moveTuples.map(
        (moveTuple) => {
          const [columnIndex, playerID] = moveTuple;
          return {
            columnIndex: columnIndex,
            gameSessionID: mockGameSessionID,
            playerID: playerID,
            timestamp: new Date(),
          };
        },
      );

      const testGameSessionDocument = (await gameSessionsService.updateOne(
        mockGameSessionID,
        {
          moves: playerMovesFromTuples,
        },
      )) as GameSessionDocument;
      const testGameSessionID = testGameSessionDocument._id.toJSON();
      const { playerOne: testPlayerOne, playerTwo: testPlayerTwo } =
        testGameSessionDocument;

      let logicSession: LogicSession = new GameLogicEngine().startGame({
        playerOneID: testPlayerOne.playerID,
        playerTwoID: testPlayerTwo.playerID,
      });
      logicSession = populateBoardWithMoves({
        logicSessionRef: logicSession,
        moves: moveTuples,
      });

      let testBoardStateDocument =
        await boardStatesService.findOneByGameSessionID(testGameSessionID);
      testBoardStateDocument = (await boardStatesService.updateOne(
        testBoardStateDocument!._id.toJSON(),
        {
          gameSessionID: testGameSessionID,
          cells: logicSession.board.gameBoardState,
        },
      )) as BoardStateDocument;

      const expectedCells = Array.from(testBoardStateDocument.cells);
      const colIndex = 0;
      const rowIndex = BOARD_ROWS - 4;
      const winningMove = {
        columnIndex: 0,
        gameSessionID: testGameSessionID,
        playerID: testPlayerOne.playerID,
        timestamp: new Date(),
      };
      expectedCells[colIndex][rowIndex].cellState = testPlayerOne.playerID;
      const expectedMoves = [...testGameSessionDocument.moves, winningMove];
      /* END TEST SETUP */

      await gateway.onMakeMove({ ...winningMove });

      const winningSendMoveEvent = {
        event: SEND_MOVE,
        data: {
          id: testGameSessionID,
          boardCells: expectedCells,
          moves: expectedMoves,
          playerOneID: testPlayerOne.playerID,
          playerOneUsername: testPlayerOne.username,
          playerTwoID: testPlayerTwo.playerID,
          playerTwoUsername: testPlayerTwo.username,
          status: GameSessionStatus.COMPLETED,
          winner: testPlayerOne.playerID,
        },
      };

      expect(
        // @ts-expect-error: Until I can figure out a better way to mock the client
        activeGameSession?.get(testPlayerOne.playerID).send,
      ).toHaveBeenNthCalledWith(1, JSON.stringify(winningSendMoveEvent));
      expect(
        // @ts-expect-error: Until I can figure out a better way to mock the client
        activeGameSession?.get(testPlayerTwo.playerID).send,
      ).toHaveBeenNthCalledWith(1, JSON.stringify(winningSendMoveEvent));
    });
  });
});
