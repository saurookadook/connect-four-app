import { randomUUID, UUID } from 'node:crypto';
import { Test, TestingModule } from '@nestjs/testing';
import { getConnectionToken } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';

import { PLAYER_MODEL_TOKEN } from '@/constants';
import { databaseProviders } from '@/database/database.providers';
import { Player, PlayerDocument } from '@/player/schemas/player.schema';
import { expectHydratedDocumentToMatch } from '@/utils/testing';
import { AuthModule } from './auth.module';
import { AuthenticationService } from './authentication.service';

const mockNow = new Date();
const mockPlayerData = {
  playerID: randomUUID(),
  username: 'testuser',
  unhashedPassword: 'securepassword',
  createdAt: mockNow,
  updatedAt: mockNow,
};

describe('AuthenticationService', () => {
  let mongoConnection: Connection;
  let service: AuthenticationService;
  let model: Model<Player>;

  beforeAll(async () => {
    jest.useFakeTimers({
      doNotFake: ['nextTick', 'setImmediate'],
      now: mockNow,
    });

    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ...databaseProviders, // force formatting
        AuthModule,
      ],
    }).compile();

    mongoConnection = await module.resolve(getConnectionToken());
    service = await module.resolve(AuthenticationService);
    model = await module.resolve(PLAYER_MODEL_TOKEN);
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

  describe("'register' method", () => {
    it('should register a new player and return the player document', async () => {
      const registeredPlayer = await service.register(mockPlayerData);

      expectHydratedDocumentToMatch<Player>(
        registeredPlayer, // force formatting
        {
          password: expect.not.stringMatching(mockPlayerData.unhashedPassword),
          // TODO: should maybe just extend `expect`?
          playerID: expect.stringMatching(
            /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/,
          ),
          username: mockPlayerData.username,
        },
      );
    });
  });

  describe("'login' method", () => {
    it('should authenticate a player and return the player document', async () => {
      await service.register(mockPlayerData);

      const loggedInPlayer = (await service.login({
        username: mockPlayerData.username,
        unhashedPassword: mockPlayerData.unhashedPassword,
      })) as PlayerDocument;

      expectHydratedDocumentToMatch<Player>(
        loggedInPlayer, // force formatting
        {
          ...mockPlayerData,
          password: expect.not.stringMatching(mockPlayerData.unhashedPassword),
          // TODO: should maybe just extend `expect`?
          playerID: expect.stringMatching(
            /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/,
          ),
        },
      );
    });
  });

  describe("'logout' method", () => {
    it('should log out a player and return a success message', async () => {
      await service.register(mockPlayerData);

      const logoutMessage = await service.logout(mockPlayerData.playerID);

      expect(logoutMessage).toBe('Player logged out successfully');
    });
  });
});
