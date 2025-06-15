import { randomUUID } from 'node:crypto';
import { Test, TestingModule } from '@nestjs/testing';
import { getConnectionToken } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';

import { PLAYER_MODEL_TOKEN } from '@/constants';
import { databaseProviders } from '@/database/database.providers';
import { Player } from '@/player/schemas/player.schema';
import { AuthModule } from './auth.module';
import { AuthService } from './auth.service';

const mockPlayerData = {
  playerID: randomUUID(),
  username: 'testuser',
  password: 'securepassword',
};

describe('AuthService', () => {
  let mongoConnection: Connection;
  let service: AuthService;
  let model: Model<Player>;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ...databaseProviders, // force formatting
        AuthModule,
      ],
    }).compile();

    mongoConnection = await module.resolve(getConnectionToken());
    service = await module.resolve(AuthService);
    model = await module.resolve(PLAYER_MODEL_TOKEN);
  });

  afterEach(async () => {
    await model.deleteMany({}).exec();
    jest.resetAllMocks();
  });

  afterAll(async () => {
    await model.deleteMany({}).exec();
    await mongoConnection.close();
  });

  // Add your tests here
  describe("'register' method", () => {
    it('should register a new player and return the player document', async () => {
      const registeredPlayer = await service.register(mockPlayerData);

      expect(registeredPlayer).toHaveProperty(
        'playerID',
        mockPlayerData.playerID,
      );
      expect(registeredPlayer).toHaveProperty(
        'username',
        mockPlayerData.username,
      );
      expect(registeredPlayer).toHaveProperty('createdAt');
      expect(registeredPlayer).toHaveProperty('updatedAt');
    });
  });

  describe("'login' method", () => {
    it('should authenticate a player and return the player document', async () => {
      await service.register(mockPlayerData);

      const loggedInPlayer = await service.login({
        username: mockPlayerData.username,
        password: mockPlayerData.password,
      });

      expect(loggedInPlayer).toHaveProperty(
        'playerID',
        mockPlayerData.playerID,
      );
      expect(loggedInPlayer).toHaveProperty(
        'username',
        mockPlayerData.username,
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
