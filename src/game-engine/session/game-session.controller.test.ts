import { INestApplication } from '@nestjs/common';
import { getConnectionToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Connection, Model } from 'mongoose';
import * as request from 'supertest';
import { App } from 'supertest/types';

import { mockNow } from '@/__mocks__/commonMocks';
import { mockPlayers } from '@/__mocks__/playerMocks';
import { PlayerModule } from '@/player/player.module';
import { Player } from '@/player/schemas/player.schema';
import {
  GAME_SESSION_MODEL_TOKEN,
  PLAYER_MODEL_TOKEN,
  GameSessionStatus,
} from '@/constants';
import { databaseProviders } from '@/database/database.providers';
import { GameSession } from '../schemas/game-session.schema';
import { GameSessionModule } from './game-session.module';
import { GameSessionService } from './game-session.service';

describe('GameSessionController', () => {
  const [mockFirstPlayer, mockSecondPlayer, mockThirdPlayer] = mockPlayers;

  let app: INestApplication<App>;
  let mongoConnection: Connection;
  let playerModel: Model<Player>;
  let service: GameSessionService;
  let model: Model<GameSession>;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ...databaseProviders, // force formatting
        GameSessionModule,
        PlayerModule,
      ],
    }).compile();

    app = module.createNestApplication();
    mongoConnection = await app.resolve(getConnectionToken());

    playerModel = await app.resolve(PLAYER_MODEL_TOKEN);
    service = await app.resolve(GameSessionService);
    model = await app.resolve(GAME_SESSION_MODEL_TOKEN);
    await app.init();
  });

  beforeEach(async () => {
    await playerModel.insertMany([
      mockFirstPlayer,
      mockSecondPlayer,
      mockThirdPlayer,
    ]);
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

  afterAll(async () => {
    await model.deleteMany({}).exec();
    await mongoConnection.close();
    jest.useRealTimers();
  });

  describe('/game-session/history (GET)', () => {
    it('should return game session history for a player', async () => {
      await request(app.getHttpServer())
        .get(`/game-session/history/${mockFirstPlayer.playerID}`)
        .expect((result) => {
          // console.log({ result });
          const resultBody = JSON.parse(result.text);
          expect(resultBody.sessions).toHaveLength(2);
          // TODO: add more assertions
          expect(result.status).toBe(200);
        });

      await request(app.getHttpServer())
        .get(`/game-session/history/${mockSecondPlayer.playerID}`)
        .expect((result) => {
          // console.log({ result });
          const resultBody = JSON.parse(result.text);
          expect(resultBody.sessions).toHaveLength(3);
          // TODO: add more assertions
          expect(result.status).toBe(200);
        });

      await request(app.getHttpServer())
        .get(`/game-session/history/${mockThirdPlayer.playerID}`)
        .expect((result) => {
          // console.log({ result });
          const resultBody = JSON.parse(result.text);
          expect(resultBody.sessions).toHaveLength(1);
          // TODO: add more assertions
          expect(result.status).toBe(200);
        });
    });
  });
});
