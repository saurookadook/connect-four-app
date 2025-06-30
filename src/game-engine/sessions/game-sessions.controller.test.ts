import { INestApplication } from '@nestjs/common';
import { getConnectionToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Connection, Model } from 'mongoose';
import * as request from 'supertest';
import { App } from 'supertest/types';

import { mockNow } from '@/__mocks__/commonMocks';
import { createNewGameSessionMock } from '@/__mocks__/gameSessionMocks';
import { mockPlayers } from '@/__mocks__/playerMocks';
import { GAME_SESSION_MODEL_TOKEN, PLAYER_MODEL_TOKEN } from '@/constants';
import { DatabaseModule } from '@/database/database.module';
import { HttpExceptionFilterProvider } from '@/filters/filters.providers';
import { PlayerModule } from '@/player/player.module';
import { Player } from '@/player/schemas/player.schema';
import { expectSerializedDocumentToMatch } from '@/utils/testing';
import { GameSession } from '../schemas/game-session.schema';
import { GameSessionsModule } from './game-sessions.module';
import { GameSessionsService } from './game-sessions.service';

describe('GameSessionsController', () => {
  const [mockFirstPlayer, mockSecondPlayer, mockThirdPlayer] = mockPlayers;

  let app: INestApplication<App>;
  let mongoConnection: Connection;
  let playerModel: Model<Player>;
  let service: GameSessionsService;
  let model: Model<GameSession>;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        DatabaseModule, // force formatting
        GameSessionsModule,
        PlayerModule,
      ],
      providers: [HttpExceptionFilterProvider],
    }).compile();

    app = module.createNestApplication();
    mongoConnection = await app.resolve(getConnectionToken());

    playerModel = await app.resolve(PLAYER_MODEL_TOKEN);
    service = await app.resolve(GameSessionsService);
    model = await app.resolve(GAME_SESSION_MODEL_TOKEN);
    await app.init();

    await playerModel.insertMany([
      mockFirstPlayer,
      mockSecondPlayer,
      mockThirdPlayer,
    ]);
  });

  afterAll(async () => {
    await playerModel.deleteMany({}).exec();
    await model.deleteMany({}).exec();
    await mongoConnection.close();
    jest.useRealTimers();
  });

  describe('/game-sessions/history (GET)', () => {
    beforeEach(async () => {
      await service.createOne({
        playerOneID: mockFirstPlayer.playerID,
        playerTwoID: mockSecondPlayer.playerID,
      });
      await service.createOne({
        playerOneID: mockSecondPlayer.playerID,
        playerTwoID: mockFirstPlayer.playerID,
      });
      await service.createOne({
        playerOneID: mockThirdPlayer.playerID,
        playerTwoID: mockSecondPlayer.playerID,
      });
    });

    afterEach(async () => {
      await model.deleteMany({}).exec();
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
