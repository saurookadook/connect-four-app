import { getConnectionToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Connection, Model, Types } from 'mongoose';

import {
  BOARD_ROWS, // force formatting
  GameSessionStatus,
  type PlayerMove,
} from '@connect-four-app/shared';
import {
  createBoardStateDocumentMock,
  type BoardStateDocumentMock,
} from '@/__mocks__/boardStatesMocks';
import { mockNow } from '@/__mocks__/commonMocks';
import {
  createNewGameSessionMock,
  type GameSessionMock,
} from '@/__mocks__/gameSessionsMocks';
import { mockPlayers } from '@/__mocks__/playerMocks';
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
} from '@/game-engine/schemas';
import { GameSessionsModule } from '@/game-engine/sessions/game-sessions.module';
import { Player } from '@/player/schemas/player.schema';
import { expectHydratedDocumentToMatch } from '@/utils/testing';
import { BoardStatesModule } from './board-states.module';
import { BoardStatesService } from './board-states.service';

const [mockFirstPlayer, mockSecondPlayer] = mockPlayers;

describe('BoardStatesService', () => {
  let mongoConnection: Connection;
  let boardStateModel: Model<BoardState>;
  let boardStatesService: BoardStatesService;
  let gameSessionModel: Model<GameSession>;
  let playerModel: Model<Player>;
  let mockGameSession: GameSessionMock;
  let mockGameSessionID: string;
  let mockBoardStateDocument: BoardStateDocumentMock;

  beforeAll(async () => {
    jest.useFakeTimers({
      doNotFake: ['nextTick', 'setImmediate'],
      now: mockNow,
    });
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        DatabaseModule, // force formatting
        BoardStatesModule,
        GameSessionsModule,
      ],
    }).compile();

    mongoConnection = await module.resolve(getConnectionToken());
    boardStateModel = await module.resolve(BOARD_STATE_MODEL_TOKEN);
    boardStatesService = await module.resolve(BoardStatesService);
    gameSessionModel = await module.resolve(GAME_SESSION_MODEL_TOKEN);
    playerModel = await module.resolve(PLAYER_MODEL_TOKEN);

    await playerModel.insertMany([
      mockFirstPlayer, // force formatting
      mockSecondPlayer,
    ]);

    mockGameSession = createNewGameSessionMock({
      playerOneID: mockFirstPlayer.playerID,
      playerTwoID: mockSecondPlayer.playerID,
    });

    const gameSessionDoc = await gameSessionModel.insertOne({
      ...mockGameSession,
    });
    mockGameSessionID = gameSessionDoc._id.toJSON();

    mockBoardStateDocument = createBoardStateDocumentMock(mockGameSessionID);
  });

  beforeEach(async () => {
    await boardStateModel.deleteMany({}).exec();
    jest.clearAllTimers();
  });

  afterAll(async () => {
    await boardStateModel.deleteMany({}).exec();
    await gameSessionModel.deleteMany({}).exec();
    await playerModel.deleteMany({}).exec();
    await mongoConnection.close();
    jest.useRealTimers();
  });

  it('should be defined', () => {
    expect(boardStatesService).toBeDefined();
  });

  describe("'createOne' method", () => {
    beforeEach(() => {
      jest.setSystemTime(mockNow);
      jest.spyOn(global.Date, 'now').mockReturnValue(mockNow.getTime());
    });

    afterEach(async () => {
      await boardStateModel.deleteMany({}).exec();
      jest.clearAllTimers();
    });

    it('should insert a new board state document', async () => {
      const newBoardState = await boardStatesService.createOne({
        gameSessionID: mockGameSessionID,
      });

      expectHydratedDocumentToMatch<BoardState>(
        newBoardState, // force formatting
        {
          ...mockBoardStateDocument,
        },
      );
    });

    it('throws error if game session cannot be found', async () => {
      await expect(
        boardStatesService.createOne({
          gameSessionID: new Types.ObjectId().toString(),
        }),
      ).rejects.toThrow();
    });
  });

  describe("'findOneByGameSessionID' method", () => {
    let initialBoardState: BoardStateDocument;

    beforeEach(async () => {
      jest.setSystemTime(mockNow);
      jest.spyOn(global.Date, 'now').mockReturnValue(mockNow.getTime());

      initialBoardState = await boardStatesService.createOne({
        gameSessionID: mockGameSessionID,
      });
    });

    afterEach(async () => {
      await boardStateModel.deleteMany({}).exec();
      jest.clearAllTimers();
    });

    it("should find a board state document by 'gameSessionID'", async () => {
      const foundBoardState = (await boardStatesService.findOneByGameSessionID(
        mockGameSessionID,
      )) as BoardStateDocument;

      expectHydratedDocumentToMatch<BoardState>(
        foundBoardState, // force formatting
        {
          ...mockBoardStateDocument,
        },
      );
    });
  });

  describe("'updateOne' method", () => {
    let initialBoardState: BoardStateDocument;

    beforeEach(async () => {
      jest.setSystemTime(mockNow);
      jest.spyOn(global.Date, 'now').mockReturnValue(mockNow.getTime());

      initialBoardState = await boardStatesService.createOne({
        gameSessionID: mockGameSessionID,
      });
    });

    afterEach(async () => {
      await boardStateModel.deleteMany({}).exec();
      jest.clearAllTimers();
    });

    it('should update a board state document', async () => {
      expectHydratedDocumentToMatch<BoardState>(
        initialBoardState, // force formatting
        {
          ...mockBoardStateDocument,
        },
      );

      const nowPlus30Seconds = new Date(mockNow.getTime() + 30000);
      const initialBoardStateID = initialBoardState._id.toString();
      const initialGameSessionID = initialBoardState.gameSessionID.toJSON();
      const latestMove: PlayerMove = {
        columnIndex: 3,
        gameSessionID: initialGameSessionID,
        playerID: mockFirstPlayer.playerID,
        timestamp: nowPlus30Seconds,
      };
      const expectedCells = Array.from(initialBoardState.cells);
      const lastRowIndex = BOARD_ROWS - 1;
      expectedCells[3][lastRowIndex].cellState = mockFirstPlayer.playerID;

      const updatedBoardState = (await boardStatesService.updateOne(
        initialBoardStateID,
        {
          gameSessionID: initialGameSessionID,
          move: latestMove,
        },
      )) as BoardStateDocument;

      expect(updatedBoardState.cells[3][lastRowIndex]).toEqual(
        expectedCells[3][lastRowIndex],
      );
      expectHydratedDocumentToMatch<BoardState>(
        updatedBoardState, // force formatting
        {
          ...mockBoardStateDocument,
          cells: expectedCells,
        },
      );
    });
  });

  describe("'deleteOneByGameSessionID' method", () => {
    let initialBoardState: BoardStateDocument;

    beforeEach(async () => {
      jest.setSystemTime(mockNow);
      jest.spyOn(global.Date, 'now').mockReturnValue(mockNow.getTime());

      initialBoardState = await boardStatesService.createOne({
        gameSessionID: mockGameSessionID,
      });
    });

    afterEach(async () => {
      await boardStateModel.deleteMany({}).exec();
      jest.clearAllTimers();
    });

    it('should delete a board state document', async () => {
      expectHydratedDocumentToMatch<BoardState>(
        initialBoardState, // force formatting
        {
          ...mockBoardStateDocument,
        },
      );

      const deletedBoardState =
        (await boardStatesService.deleteOneByGameSessionID(
          mockGameSessionID,
        )) as BoardStateDocument;

      expectHydratedDocumentToMatch<BoardState>(
        deletedBoardState, // force formatting
        {
          ...mockBoardStateDocument,
        },
      );

      const emptyResult =
        await boardStatesService.findOneByGameSessionID(mockGameSessionID);
      expect(emptyResult).toBeNull();
    });
  });
});
