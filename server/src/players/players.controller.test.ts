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
import { Player } from '@/players/schemas/player.schema';
import { PlayersModule } from '@/players/players.module';
import { PlayersService } from '@/players/players.service';
import { expectSerializedDocumentToMatch } from '@/utils/testing';

describe('GameSessionsController', () => {
  const [mockFirstPlayer, mockSecondPlayer, mockThirdPlayer] = mockPlayers;

  let app: INestApplication<App>;
  let mongoConnection: Connection;
  let playerModel: Model<Player>;
  let playersService: PlayersService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        DatabaseModule, // force formatting
        PlayersModule,
      ],
      providers: [CatchAllFilterProvider, HttpExceptionFilterProvider],
    }).compile();

    app = module.createNestApplication();
    applyGlobalSessionMiddleware(app);

    await app.init();

    mongoConnection = await app.resolve(getConnectionToken());
    playerModel = await app.resolve(PLAYER_MODEL_TOKEN);
    playersService = await app.resolve(PlayersService);

    await playerModel.insertMany([
      mockFirstPlayer,
      mockSecondPlayer,
      mockThirdPlayer,
    ]);
  });

  afterEach(async () => {
    await playerModel.deleteMany({}).exec();
  });

  afterAll(async () => {
    await playerModel.deleteMany({}).exec();
    await mongoConnection.close();
    jest.useRealTimers();
  });

  describe('/players/:playerID (GET)', () => {
    it.skip("should get a player document given a 'playerID'", () => {
      expect('implement me!').toBe(false);
    });

    it.skip("should respond with error details if no player document can be found for a given 'playerID'", () => {
      expect('implement me!').toBe(false);
    });
  });

  describe('/players/all (GET)', () => {
    it.skip('should get all player documents', () => {
      expect('implement me!').toBe(false);
    });

    it.skip("should get all player documents excluding those with the given 'pids' search param", () => {
      expect('implement me!').toBe(false);
    });

    it.skip('should return empty array if no player documents can be found', () => {
      expect('implement me!').toBe(false);
    });

    it.skip('should return empty array if no player documents can be found for given search criteria', () => {
      expect('implement me!').toBe(false);
    });
  });
});
