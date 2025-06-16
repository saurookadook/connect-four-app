import { randomUUID } from 'node:crypto';
import { Test, TestingModule } from '@nestjs/testing';
import { getConnectionToken } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { ObjectId } from 'mongodb';

import { PLAYER_MODEL_TOKEN } from '@/constants';
import { databaseProviders } from '@/database/database.providers';
import { Player } from '@/player/schemas/player.schema';
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
      const registeredPlayerResult = await service.register(mockPlayerData);

      expect(registeredPlayerResult).toEqual(
        expect.objectContaining({
          message: 'Registration successful!',
          playerID: expect.toBeUUID(),
          playerObjectID: expect.any(ObjectId),
          username: mockPlayerData.username,
        }),
      );
    });
  });

  describe("'login' method", () => {
    it('should authenticate a player and return the player document', async () => {
      await service.register(mockPlayerData);

      const loggedInPlayerResult = await service.login({
        username: mockPlayerData.username,
        unhashedPassword: mockPlayerData.unhashedPassword,
      });

      expect(loggedInPlayerResult).toEqual(
        expect.objectContaining({
          message: 'Login successful!',
          playerID: expect.toBeUUID(),
          playerObjectID: expect.any(ObjectId),
          username: mockPlayerData.username,
        }),
      );
    });
  });

  // TODO: fix test once method is implemented
  describe("'logout' method", () => {
    it('should log out a player and return a success message', async () => {
      await service.register(mockPlayerData);

      const logoutMessage = await service.logout(mockPlayerData.playerID);

      expect(logoutMessage).toBe('Logout successful!');
    });
  });
});
