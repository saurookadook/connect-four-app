/* eslint-disable @typescript-eslint/unbound-method */
import { getConnectionToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Connection, Model, Types } from 'mongoose';
import ws from 'ws';
import WSMock from 'jest-websocket-mock';

import { SEND_MOVE } from '@connect-four-app/shared';
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
import { BoardState, GameSession } from '@/game-engine/schemas';
import { GameSessionsService } from '@/game-engine/sessions/game-sessions.service';
import { GameEngineModule } from '@/game-engine/game-engine.module';
import { Player } from '@/player/schemas/player.schema';
import { PlayerService } from '@/player/player.service';
import { GameEventsGateway, type GameSessionMap } from './game-events.gateway';

const mockThirdPlayer = mockPlayers[2];

describe('GameEventsGateway', () => {
  const mockGameSession = createNewGameSessionDocumentMock({
    _id: new Types.ObjectId(),
    playerOneID: mockPlayerOneID,
    playerTwoID: mockPlayerTwoID,
  });
  const mockGameSessionID = mockGameSession._id!.toString();

  let mongoConnection: Connection;
  let boardStateModel: Model<BoardState>;
  let boardStatesService: BoardStatesService;
  let gameSessionModel: Model<GameSession>;
  let gameSessionsService: GameSessionsService;
  let playerModel: Model<Player>;
  let playerService: PlayerService;
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
    playerService = await module.resolve(PlayerService);
    await Promise.all(
      mockPlayers.map((player) => playerService.createOne({ ...player })),
    );

    boardStatesService = await module.resolve(BoardStatesService);
    gameSessionsService = await module.resolve(GameSessionsService);
    await gameSessionsService.createOne(mockGameSession);

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

      await gateway.onMakeMove({
        columnIndex: 1,
        gameSessionID: mockGameSessionID,
        playerID: mockPlayerOneID,
        timestamp: firstTimestamp,
      });

      let updatedGameSession =
        await gameSessionsService.findOneById(mockGameSessionID);
      let updatedBoardState =
        await boardStatesService.findOneByGameSessionID(mockGameSessionID);

      const firstSendMoveEvent = {
        event: SEND_MOVE,
        data: {
          id: mockGameSessionID,
          boardCells: updatedBoardState?.cells,
          moves: updatedGameSession?.moves,
          playerOneID: updatedGameSession?.playerOneID,
          playerTwoID: updatedGameSession?.playerTwoID,
          status: updatedGameSession?.status,
        },
      };

      expect(
        // @ts-expect-error: Until I can figure out a better way to mock the client
        activeGameSession?.get(mockPlayerOneID).send,
      ).toHaveBeenNthCalledWith(1, JSON.stringify(firstSendMoveEvent));
      expect(
        // @ts-expect-error: Until I can figure out a better way to mock the client
        activeGameSession?.get(mockPlayerTwoID).send,
      ).toHaveBeenNthCalledWith(1, JSON.stringify(firstSendMoveEvent));

      await gateway.onMakeMove({
        columnIndex: 1,
        gameSessionID: mockGameSessionID,
        playerID: mockPlayerTwoID,
        timestamp: secondTimestamp,
      });

      updatedGameSession =
        await gameSessionsService.findOneById(mockGameSessionID);
      updatedBoardState =
        await boardStatesService.findOneByGameSessionID(mockGameSessionID);

      const secondSendMoveEvent = {
        event: SEND_MOVE,
        data: {
          ...firstSendMoveEvent.data,
          boardCells: updatedBoardState?.cells,
          moves: updatedGameSession?.moves,
        },
      };

      expect(
        // @ts-expect-error: Until I can figure out a better way to mock the client
        activeGameSession?.get(mockPlayerOneID).send,
      ).toHaveBeenNthCalledWith(2, JSON.stringify(secondSendMoveEvent));
      expect(
        // @ts-expect-error: Until I can figure out a better way to mock the client
        activeGameSession?.get(mockPlayerTwoID).send,
      ).toHaveBeenNthCalledWith(2, JSON.stringify(secondSendMoveEvent));
    });
  });
});
