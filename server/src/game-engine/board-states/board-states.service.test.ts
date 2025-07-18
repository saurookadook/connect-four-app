// @ts-nocheck
import { getConnectionToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Connection, Model, Types } from 'mongoose';

import { mockNow } from '@/__mocks__/commonMocks';
import { createNewGameSessionMock } from '@/__mocks__/gameSessionsMocks';
import { mockPlayers } from '@/__mocks__/playerMocks';
import {
  BOARD_STATE_MODEL_TOKEN,
  GAME_SESSION_MODEL_TOKEN,
  PLAYER_MODEL_TOKEN,
  GameSessionStatus,
} from '@/constants';
import { DatabaseModule } from '@/database/database.module';
import { BoardStateDTO, GameSessionDTO } from '@/game-engine/dtos';
import {
  BoardState,
  BoardStateDocument,
  createEmptyBoard,
  GameSession,
} from '@/game-engine/schemas';
import { Player } from '@/player/schemas/player.schema';
import { PlayerMove } from '@/types/main';
import { expectHydratedDocumentToMatch } from '@/utils/testing';
import { GameSessionsModule } from '../sessions/game-sessions.module';
import { BoardStatesModule } from './board-states.module';
import { BoardStatesService } from './board-states.service';

const [mockFirstPlayer, mockSecondPlayer] = mockPlayers;

type BoardStateDocumentMock = {
  _id: Types.ObjectId;
  gameSessionID: Types.ObjectId;
  state: ReturnType<typeof createEmptyBoard>;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
};

const createBoardStateDocumentMock = (
  gameSessionID: string,
): BoardStateDocumentMock => {
  return {
    _id: new Types.ObjectId(),
    gameSessionID: new Types.ObjectId(gameSessionID),
    state: createEmptyBoard(),
    createdAt: mockNow,
    updatedAt: mockNow,
    __v: 1,
  };
};

describe('BoardStatesService', () => {
  let mongoConnection: Connection;
  let boardStateModel: Model<BoardState>;
  let boardStatesService: BoardStatesService;
  let gameSessionModel: Model<GameSession>;
  let playerModel: Model<Player>;
  let mockGameSession: GameSessionDTO;
  let mockBoardState: BoardStateDTO;
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

    const { id, ...rest } = mockGameSession;
    await gameSessionModel.insertOne({
      ...rest,
      _id: id,
    });

    mockBoardStateDocument = createBoardStateDocumentMock(mockGameSession.id);
  });

  beforeEach(() => {
    jest.clearAllTimers();
  });

  afterAll(async () => {
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
      await gameSessionModel.deleteMany({}).exec();
      jest.clearAllTimers();
    });

    it('should insert a new board state document', async () => {
      const newBoardState = await boardStatesService.createOne({
        gameSessionID: mockGameSession.id,
      });

      expectHydratedDocumentToMatch<BoardState>(newBoardState, {
        ...mockBoardStateDocument,
      });
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
        gameSessionID: mockGameSession.id,
      });
    });

    afterEach(async () => {
      await boardStateModel.deleteMany({}).exec();
      jest.clearAllTimers();
    });

    it("should find a board state document by 'gameSessionID'", async () => {
      const foundBoardState = await boardStatesService.findOneByGameSessionID(
        initialBoardState.gameSessionID.toString(),
      );

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
        gameSessionID: mockGameSession.id,
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
      const nowPlus1Minute = new Date(mockNow.getTime() + 60000);
      const initialBoardStateID = initialBoardState._id.toString();
      const latestMove: PlayerMove = {
        columnIndex: 3,
        gameSessionID: initialBoardState.gameSessionID.toString(),
        playerID: mockFirstPlayer.playerID,
        timestamp: new Date(),
      };

      const updatedBoardState = await boardStatesService.updateOne(
        initialBoardStateID,
        {
          move: latestMove,
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
        gameSessionID: mockGameSession.id,
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

      const initialID = initialBoardState._id.toString();
      const deletedBoardState =
        await boardStatesService.deleteOneByGameSessionID(mockGameSession.id);

      expectHydratedDocumentToMatch<BoardState>(
        deletedBoardState, // force formatting
        {
          ...mockBoardStateDocument,
        },
      );

      const emptyResult = await boardStatesService.findOneByGameSessionID(
        mockGameSession.id,
      );
      expect(emptyResult).toBeNull();
    });
  });
});
