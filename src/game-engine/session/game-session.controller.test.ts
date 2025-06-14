import { randomUUID } from 'node:crypto';
import { getConnectionToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Connection, Model } from 'mongoose';

import { GAME_SESSION_MODEL_TOKEN, GameSessionStatus } from '@/constants';
import { databaseProviders } from '@/database/database.providers';
import { GameSession } from '@/game-engine/schemas/game-session.schema';
import { GameSessionController } from '@/game-engine/session/game-session.controller';
import { GameSessionModule } from '@/game-engine/session/game-session.module';
import { GameSessionService } from '@/game-engine/session/game-session.service';

const mockFirstPlayerID = randomUUID();
const mockSecondPlayerID = randomUUID();
const mockThirdPlayerID = randomUUID();

describe('GameSessionController', () => {
  let mongoConnection: Connection;
  let controller: GameSessionController;
  let service: GameSessionService;
  let model: Model<GameSession>;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ...databaseProviders, // force formatting
        GameSessionModule,
      ],
    }).compile();

    mongoConnection = await module.resolve(getConnectionToken());
    controller = await module.resolve(GameSessionController);
    service = await module.resolve(GameSessionService);
    model = await module.resolve(GAME_SESSION_MODEL_TOKEN);
  });

  beforeEach(async () => {
    await service.createOne({
      playerOneID: mockFirstPlayerID,
      playerTwoID: mockSecondPlayerID,
    });
    await service.createOne({
      playerOneID: mockSecondPlayerID,
      playerTwoID: mockFirstPlayerID,
    });
    await service.createOne({
      playerOneID: mockThirdPlayerID,
      playerTwoID: mockSecondPlayerID,
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

  describe('/game-session/history', () => {
    it('should return game session history for a player', async () => {
      const playerOneResults =
        await controller.getGameSessionHistory(mockFirstPlayerID);

      expect(playerOneResults).toHaveLength(2);
    });
  });
});
