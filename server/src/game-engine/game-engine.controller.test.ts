import { INestApplication } from '@nestjs/common';
import { getConnectionToken } from '@nestjs/mongoose';
import { WsAdapter } from '@nestjs/platform-ws';
import { Test, TestingModule } from '@nestjs/testing';
import { Connection, Model } from 'mongoose';
import request from 'supertest';
import { App } from 'supertest/types';

import { sharedLog } from '@connect-four-app/shared';
import { createBoardStateDocumentMock } from '@/__mocks__/boardStatesMocks';
import { createNewGameSessionMock } from '@/__mocks__/gameSessionsMocks';
import {
  mockFirstPlayer as mockFirstPlayerRawPassword,
  mockPlayers,
  type MockPlayer,
} from '@/__mocks__/playerMocks';
import { GAME_SESSION_MODEL_TOKEN, PLAYER_MODEL_TOKEN } from '@/constants';
import {
  CatchAllFilterProvider,
  HttpExceptionFilterProvider,
} from '@/filters/filters.providers';
import {
  BoardState, // force formatting
  GameSession,
} from '@/game-engine/schemas';
import { Player } from '@/players/schemas/player.schema';
import { expectSerializedDocumentToMatch } from '@/utils/testing';
import { AppModule } from '@/app.module';

const logger = sharedLog.getLogger('GameEngineController__tests');

async function getSessionCookieForPlayer({
  requestRef,
  nestApp,
  mockPlayer,
}: {
  requestRef: typeof request;
  nestApp: INestApplication;
  mockPlayer: MockPlayer;
}) {
  const response = await requestRef(nestApp.getHttpServer())
    .post('/auth/login')
    .send({
      username: mockPlayer.username,
      password: mockPlayer.unhashedPassword,
    });

  const setCookieHeader = new Headers(response.headers).get('set-cookie');
  if (setCookieHeader == null || setCookieHeader == '') {
    throw new Error(
      `[${getSessionCookieForPlayer.name}] No cookie value found in response headers! :(`,
    );
  }

  return setCookieHeader.match(/connect\.sid=\S+[^;]/im)![0];
}

describe('GameEngineController', () => {
  const [mockFirstPlayer, mockSecondPlayer, mockThirdPlayer] = mockPlayers;

  const mockGameSessionDocument = createNewGameSessionMock({
    playerOneID: mockFirstPlayer.playerID,
    playerOneUsername: mockFirstPlayer.username,
    playerTwoID: mockSecondPlayer.playerID,
    playerTwoUsername: mockSecondPlayer.username,
  });
  const mockBoardStateDocument = createBoardStateDocumentMock();

  let app: INestApplication<App>;
  let mongoConnection: Connection;
  let cookieValue: string;
  let playerModel: Model<Player>;
  let gameSessionModel: Model<GameSession>;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        AppModule, // force formatting
      ],
      providers: [CatchAllFilterProvider, HttpExceptionFilterProvider],
    }).compile();

    app = module.createNestApplication();
    app.useWebSocketAdapter(new WsAdapter(app));
    await app.init();

    mongoConnection = await app.resolve(getConnectionToken());
    playerModel = await app.resolve(PLAYER_MODEL_TOKEN);
    gameSessionModel = await app.resolve(GAME_SESSION_MODEL_TOKEN);

    await playerModel.insertMany([
      mockFirstPlayer,
      mockSecondPlayer,
      mockThirdPlayer,
    ]);

    cookieValue = await getSessionCookieForPlayer({
      requestRef: request,
      nestApp: app,
      mockPlayer: mockFirstPlayerRawPassword,
    });
  });

  afterEach(async () => {
    await gameSessionModel.deleteMany({}).exec();
  });

  afterAll(async () => {
    await playerModel.deleteMany({}).exec();
    await gameSessionModel.deleteMany({}).exec();
    await mongoConnection.close();
    await app.close();
    jest.useRealTimers();
  });

  describe('/game-engine/start (POST)', () => {
    it("should start a new game and respond with 'boardState' and 'gameSession'", async () => {
      await request(app.getHttpServer())
        .post('/game-engine/start')
        .send({
          playerOneID: mockFirstPlayer.playerID,
          playerTwoID: mockSecondPlayer.playerID,
        })
        .set({
          Accept: 'application/json',
          Cookie: cookieValue,
        })
        .expect((result) => {
          const resultBody = JSON.parse(result.text);

          logger.debug(
            'resultBody\n',
            global.inspect(
              { ...resultBody },
              { colors: true, compact: false, depth: 2 },
            ),
          );

          const { __v, ...restMockBoardState } = mockBoardStateDocument;

          expectSerializedDocumentToMatch<BoardState>(
            resultBody.boardState, // force formatting
            {
              ...restMockBoardState,
              id: expect.any(String),
              gameSessionID: expect.any(String),
            },
          );

          expectSerializedDocumentToMatch<GameSession>(
            resultBody.gameSession,
            createNewGameSessionMock({
              ...mockGameSessionDocument,
            }),
          );
          expect(resultBody.boardState.gameSessionID).toEqual(
            resultBody.gameSession.id,
          );
          expect(result.status).toBe(201);
        });
    });
  });
});
