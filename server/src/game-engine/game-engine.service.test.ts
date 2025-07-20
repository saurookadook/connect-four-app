import { Test, TestingModule } from '@nestjs/testing';
import { getConnectionToken } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';

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
import { mockPlayerOneID, mockPlayers } from '@/__mocks__/playerMocks';
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

  beforeEach(async () => {
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

  describe("'startGame' method", () => {
    // TODO
  });

  describe("'handlePlayerMove' method", () => {
    let initialGameSessionDocument: GameSessionDocument;
    let initialBoardStateDocument: BoardStateDocument;
    let mockGameSessionID: string;
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
      mockBoardStateDocument = createBoardStateDocumentMock(mockGameSessionID);
    });

    afterEach(async () => {
      await gameSessionModel.deleteMany({}).exec();
      jest.clearAllTimers();
    });

    it('should update game session and board state documents', async () => {
      const nowPlus30Seconds = new Date(mockNow.getTime() + 30000);
      const nowPlus1Minute = new Date(mockNow.getTime() + 60000);

      const updatedGameSession = await gameEngineService.handlePlayerMove({
        columnIndex: 2,
        gameSessionID: mockGameSessionID,
        playerID: mockPlayerOneID,
        timestamp: nowPlus30Seconds,
      });

      const expectedCells = Array.from(initialBoardStateDocument.state);
      const lastRowIndex = BOARD_ROWS - 1;
    });
  });
});
