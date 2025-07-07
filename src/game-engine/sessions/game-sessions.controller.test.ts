import { INestApplication } from '@nestjs/common';
import { getConnectionToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Connection, Model } from 'mongoose';
import request from 'supertest';
import { App } from 'supertest/types';

import { mockNow } from '@/__mocks__/commonMocks';
import { createNewGameSessionMock } from '@/__mocks__/gameSessionsMocks';
import { mockPlayers } from '@/__mocks__/playerMocks';
import { GAME_SESSION_MODEL_TOKEN, PLAYER_MODEL_TOKEN } from '@/constants';
import { DatabaseModule } from '@/database/database.module';
import {
  CatchAllFilterProvider,
  HttpExceptionFilterProvider,
} from '@/filters/filters.providers';
import { applyGlobalSessionMiddleware } from '@/middleware/session.middleware';
import { PlayerModule } from '@/player/player.module';
import { Player } from '@/player/schemas/player.schema';
import { expectSerializedDocumentToMatch } from '@/utils/testing';
import {
  GameSession,
  GameSessionDocument,
} from '../schemas/game-session.schema';
import { GameSessionsModule } from './game-sessions.module';
import { GameSessionsService } from './game-sessions.service';

describe('GameSessionsController', () => {
  const [mockFirstPlayer, mockSecondPlayer, mockThirdPlayer] = mockPlayers;

  let app: INestApplication<App>;
  let mongoConnection: Connection;
  let playerModel: Model<Player>;
  let gameSessionsService: GameSessionsService;
  let gameSessionModel: Model<GameSession>;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        DatabaseModule, // force formatting
        GameSessionsModule,
        PlayerModule,
      ],
      providers: [CatchAllFilterProvider, HttpExceptionFilterProvider],
    }).compile();

    app = module.createNestApplication();
    applyGlobalSessionMiddleware(app);

    await app.init();

    mongoConnection = await app.resolve(getConnectionToken());
    playerModel = await app.resolve(PLAYER_MODEL_TOKEN);
    gameSessionsService = await app.resolve(GameSessionsService);
    gameSessionModel = await app.resolve(GAME_SESSION_MODEL_TOKEN);

    await playerModel.insertMany([
      mockFirstPlayer,
      mockSecondPlayer,
      mockThirdPlayer,
    ]);
  });

  afterEach(async () => {
    await gameSessionModel.deleteMany({}).exec();
  });

  afterAll(async () => {
    await playerModel.deleteMany({}).exec();
    await gameSessionModel.deleteMany({}).exec();
    await mongoConnection.close();
    jest.useRealTimers();
  });

  describe('/game-sessions/start (POST)', () => {
    const unregisteredPlayerID = 'e3f64a31-4977-4da4-bb2b-7057b9f2c3e7';

    afterEach(async () => {
      await gameSessionModel.deleteMany({}).exec();
      jest.clearAllTimers();
    });

    it('should create a new game session', async () => {
      await request(app.getHttpServer())
        .post('/game-sessions/start')
        .send({
          playerOneID: mockFirstPlayer.playerID,
          playerTwoID: mockSecondPlayer.playerID,
        })
        .set('Accept', 'application/json')
        .expect((result) => {
          const resultBody = JSON.parse(result.text);

          expect(resultBody.session).not.toBeNull();
          expectSerializedDocumentToMatch<GameSession>(
            resultBody.session,
            createNewGameSessionMock({
              playerOneID: mockFirstPlayer.playerID,
              playerTwoID: mockSecondPlayer.playerID,
            }),
          );
          expect(result.status).toBe(201);
        });
    });

    it('should respond with error details if players are the same', async () => {
      await request(app.getHttpServer())
        .post('/game-sessions/start')
        .send({
          playerOneID: mockFirstPlayer.playerID,
          playerTwoID: mockFirstPlayer.playerID,
        })
        .set('Accept', 'application/json')
        .expect((result) => {
          const { message, statusCode } = JSON.parse(result.text);

          expect(message).toBeStringIncluding('Player IDs must be different.');
          expect(statusCode).toBe(400);
        })
        .expect(400);
    });

    it("should respond with error details if player one isn't registered", async () => {
      await request(app.getHttpServer())
        .post('/game-sessions/start')
        .send({
          playerOneID: unregisteredPlayerID,
          playerTwoID: mockFirstPlayer.playerID,
        })
        .set('Accept', 'application/json')
        .expect((result) => {
          const { message, statusCode } = JSON.parse(result.text);

          expect(message).toBeStringIncluding(
            `Player One with ID '${unregisteredPlayerID}' does not exist.`,
          );
          expect(statusCode).toBe(401);
        })
        .expect(401);
    });

    it("should respond with error details if player two isn't registered", async () => {
      await request(app.getHttpServer())
        .post('/game-sessions/start')
        .send({
          playerOneID: mockSecondPlayer.playerID,
          playerTwoID: unregisteredPlayerID,
        })
        .set('Accept', 'application/json')
        .expect((result) => {
          const { message, statusCode } = JSON.parse(result.text);

          expect(message).toBeStringIncluding(
            `Player Two with ID '${unregisteredPlayerID}' does not exist.`,
          );
          expect(statusCode).toBe(401);
        })
        .expect(401);
    });
  });

  describe('/game-sessions/all (GET)', () => {
    afterAll(async () => {
      await gameSessionModel.deleteMany({}).exec();
      jest.clearAllTimers();
    });

    it('should return all game session documents', async () => {
      const gameSessions: GameSessionDocument[] = await Promise.all([
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

      await request(app.getHttpServer())
        .get(`/game-sessions/all`)
        .expect((result) => {
          const resultBody = JSON.parse(result.text);
          expect(resultBody.sessions).toHaveLength(3);

          resultBody.sessions.forEach((foundGameSession, index) => {
            const gameSessionAtInverseIndex = gameSessions.at(-1 - index);

            expectSerializedDocumentToMatch(
              foundGameSession,
              createNewGameSessionMock({
                id: gameSessionAtInverseIndex!._id.toString(),
                playerOneID: gameSessionAtInverseIndex!.playerOneID,
                playerTwoID: gameSessionAtInverseIndex!.playerTwoID,
              }),
            );
          });
        });
    });
  });

  describe('/game-sessions/:sessionID (GET)', () => {
    it('correctly returns a game-session by its ID', async () => {
      const gameSession = await gameSessionsService.createOne({
        playerOneID: mockFirstPlayer.playerID,
        playerTwoID: mockSecondPlayer.playerID,
      });

      await request(app.getHttpServer())
        .get(`/game-sessions/${gameSession.id}`)
        .expect((result) => {
          const { session } = JSON.parse(result.text);

          expect(session).toBeDefined();
          expect(session.id).toBe(gameSession.id.toString());
          expectSerializedDocumentToMatch<GameSession>(
            session,
            createNewGameSessionMock({
              playerOneID: mockFirstPlayer.playerID,
              playerTwoID: mockSecondPlayer.playerID,
            }),
          );

          expect(result.status).toBe(200);
        })
        .expect(200);
    });

    it("should respond with error details if a game-session can't be found", async () => {
      const nonExistentGameSessionID = '6861e45ef5c14f14a62b8643';

      await request(app.getHttpServer())
        .get(`/game-sessions/${nonExistentGameSessionID}`)
        .expect((result) => {
          const { message, statusCode } = JSON.parse(result.text);

          expect(message).toBeStringIncluding(
            `Could not find 'game-session' with ID '${nonExistentGameSessionID}'.`,
          );
          expect(statusCode).toBe(404);
        })
        .expect(404);
    });
  });

  describe('/game-sessions/history (GET)', () => {
    beforeEach(async () => {
      await gameSessionsService.createOne({
        playerOneID: mockFirstPlayer.playerID,
        playerTwoID: mockSecondPlayer.playerID,
      });
      await gameSessionsService.createOne({
        playerOneID: mockSecondPlayer.playerID,
        playerTwoID: mockFirstPlayer.playerID,
      });
      await gameSessionsService.createOne({
        playerOneID: mockThirdPlayer.playerID,
        playerTwoID: mockSecondPlayer.playerID,
      });
    });

    afterEach(async () => {
      await gameSessionModel.deleteMany({}).exec();
      jest.clearAllTimers();
    });

    it('[mockFirstPlayer] should return game session history for a player', async () => {
      await request(app.getHttpServer())
        .get(`/game-sessions/history/${mockFirstPlayer.playerID}`)
        .expect((result) => {
          const resultBody = JSON.parse(result.text);
          expect(resultBody.sessions).toHaveLength(2);

          const [firstSession, secondSession] = resultBody.sessions;

          expectSerializedDocumentToMatch<GameSession>(
            firstSession,
            createNewGameSessionMock({
              playerOneID: mockFirstPlayer.playerID,
              playerTwoID: mockSecondPlayer.playerID,
            }),
          );
          expectSerializedDocumentToMatch<GameSession>(
            secondSession,
            createNewGameSessionMock({
              playerOneID: mockSecondPlayer.playerID,
              playerTwoID: mockFirstPlayer.playerID,
            }),
          );

          expect(result.status).toBe(200);
        });
    });

    it('[mockSecondPlayer] should return game session history for a player', async () => {
      await request(app.getHttpServer())
        .get(`/game-sessions/history/${mockSecondPlayer.playerID}`)
        .expect((result) => {
          const resultBody = JSON.parse(result.text);
          expect(resultBody.sessions).toHaveLength(3);

          const [firstSession, secondSession, thirdSession] =
            resultBody.sessions;

          expectSerializedDocumentToMatch<GameSession>(
            firstSession,
            createNewGameSessionMock({
              playerOneID: mockFirstPlayer.playerID,
              playerTwoID: mockSecondPlayer.playerID,
            }),
          );
          expectSerializedDocumentToMatch<GameSession>(
            secondSession,
            createNewGameSessionMock({
              playerOneID: mockSecondPlayer.playerID,
              playerTwoID: mockFirstPlayer.playerID,
            }),
          );
          expectSerializedDocumentToMatch<GameSession>(
            thirdSession,
            createNewGameSessionMock({
              playerOneID: mockThirdPlayer.playerID,
              playerTwoID: mockSecondPlayer.playerID,
            }),
          );

          expect(result.status).toBe(200);
        });
    });

    it('[mockThirdPlayer] should return game session history for a player', async () => {
      await request(app.getHttpServer())
        .get(`/game-sessions/history/${mockThirdPlayer.playerID}`)
        .expect((result) => {
          const resultBody = JSON.parse(result.text);
          expect(resultBody.sessions).toHaveLength(1);

          expectSerializedDocumentToMatch<GameSession>(
            resultBody.sessions[0],
            createNewGameSessionMock({
              playerOneID: mockThirdPlayer.playerID,
              playerTwoID: mockSecondPlayer.playerID,
            }),
          );

          expect(result.status).toBe(200);
        });
    });
  });
});
