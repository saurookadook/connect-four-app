/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import ws from 'ws';
import WSMock from 'jest-websocket-mock';

import { mockFirstPlayer, mockSecondPlayer } from '@/__mocks__/playerMocks';
import { databaseProviders } from '@/database/database.providers';
import { GameEngineModule } from '../game-engine.module';
import { GameEventsGateway, type GameSessionMap } from './game-events.gateway';
import { createNewGameSessionDocumentMock } from '@/__mocks__/gameSessionsMocks';

describe('GameEventsGateway', () => {
  const mockPlayerOneID = mockFirstPlayer.playerID;
  const mockPlayerTwoID = mockSecondPlayer.playerID;
  const mockGameSession = createNewGameSessionDocumentMock({
    playerOneID: mockPlayerOneID,
    playerTwoID: mockPlayerTwoID,
  });
  const mockGameSessionID = mockGameSession._id.toString();

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

    gateway = module.get(GameEventsGateway);
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
    activeGameSession?.set(
      mockPlayerOneID,
      // @ts-expect-error: Until I can figure out a better way to mock the client
      mockWebSocketClient(),
    );

    activeGameSession?.set(
      mockPlayerTwoID,
      // @ts-expect-error: Until I can figure out a better way to mock the client
      mockWebSocketClient(),
    );
  });

  describe('move', () => {
    it('should return passed data', async () => {
      const firstTimestamp = new Date();
      const secondTimestamp = new Date(firstTimestamp.getTime() + 2000);

      const firstMakeMoveEvent = {
        columnIndex: 1,
        gameSessionID: mockGameSession._id.toString(),
        playerID: mockPlayerOneID,
        timestamp: firstTimestamp,
      };

      await gateway.onMakeMoveEvent(firstMakeMoveEvent);

      expect(
        // @ts-expect-error: Until I can figure out a better way to mock the client
        activeGameSession?.get(mockPlayerOneID).send,
      ).toHaveBeenNthCalledWith(1, JSON.stringify(firstMakeMoveEvent));
      expect(
        // @ts-expect-error: Until I can figure out a better way to mock the client
        activeGameSession?.get(mockPlayerTwoID).send,
      ).toHaveBeenNthCalledWith(1, JSON.stringify(firstMakeMoveEvent));

      const secondMakeMoveEvent = {
        columnIndex: 1,
        gameSessionID: mockGameSession._id.toString(),
        playerID: mockPlayerTwoID,
        timestamp: secondTimestamp,
      };

      await gateway.onMakeMoveEvent(secondMakeMoveEvent);

      expect(
        // @ts-expect-error: Until I can figure out a better way to mock the client
        activeGameSession?.get(mockPlayerOneID).send,
      ).toHaveBeenNthCalledWith(2, JSON.stringify(secondMakeMoveEvent));
      expect(
        // @ts-expect-error: Until I can figure out a better way to mock the client
        activeGameSession?.get(mockPlayerTwoID).send,
      ).toHaveBeenNthCalledWith(2, JSON.stringify(secondMakeMoveEvent));
    });
  });
});
