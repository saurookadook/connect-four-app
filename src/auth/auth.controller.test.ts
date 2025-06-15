import { randomUUID } from 'node:crypto';
import { INestApplication } from '@nestjs/common';
import { getConnectionToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Connection, Model } from 'mongoose';
import * as request from 'supertest';
import { App } from 'supertest/types';

import { PLAYER_MODEL_TOKEN } from '@/constants';
import { databaseProviders } from '@/database/database.providers';
import { Player } from '@/player/schemas/player.schema';
import { AuthModule } from './auth.module';
import { AuthenticationService } from './authentication.service';

const mockNow = new Date();
const mockFirstPlayer = {
  playerID: randomUUID(),
  username: 'player_uno',
  unhashedPassword: 'superdupergoodpassword',
  createdAt: mockNow,
  updatedAt: mockNow,
};
const mockSecondPlayer = {
  playerID: randomUUID(),
  username: 'player_dos',
  unhashedPassword: 'superdupergoodpassword',
  createdAt: mockNow,
  updatedAt: mockNow,
};
const mockThirdPlayer = {
  playerID: randomUUID(),
  username: 'player_tres',
  unhashedPassword: 'superdupergoodpassword',
  createdAt: mockNow,
  updatedAt: mockNow,
};

describe('AuthController', () => {
  let app: INestApplication<App>;
  let mongoConnection: Connection;
  let service: AuthenticationService;
  let model: Model<Player>;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ...databaseProviders, // force formatting
        AuthModule,
      ],
    }).compile();

    app = module.createNestApplication();
    mongoConnection = await app.resolve(getConnectionToken());

    service = await app.resolve(AuthenticationService);
    model = await app.resolve(PLAYER_MODEL_TOKEN);
    await app.init();
  });

  beforeEach(async () => {
    await service.register({
      username: mockFirstPlayer.username,
      unhashedPassword: mockFirstPlayer.unhashedPassword,
    });
    // await service.register({
    //   username: mockSecondPlayer.username,
    //   unhashedPassword: mockSecondPlayer.unhashedPassword,
    // });
    // await service.register({
    //   username: mockThirdPlayer.username,
    //   unhashedPassword: mockThirdPlayer.unhashedPassword,
    // });
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

  describe('/auth/register (POST)', () => {
    it('should register a new player', async () => {
      await request(app.getHttpServer())
        .post('/auth/register')
        .send({
          username: mockFirstPlayer.username,
          password: mockFirstPlayer.unhashedPassword,
        })
        .set('Accept', 'application/json')
        .expect((result) => {
          // console.log({ result });
          const resultBody = JSON.parse(result.text);
          expect(resultBody.message).toEqual('Registration successful!');
          expect(resultBody.playerID).toEqual(mockFirstPlayer.playerID);
          expect(resultBody.playerObjectID).toEqual(expect.any(String));
          expect(resultBody.username).toEqual(mockFirstPlayer.username);
          expect(result.status).toBe(200);
        });
    });
  });

  describe('/auth/login (POST)', () => {
    it('should log in an existing player', async () => {
      await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          username: mockFirstPlayer.username,
          password: mockFirstPlayer.unhashedPassword,
        })
        .set('Accept', 'application/json')
        .expect((result) => {
          // console.log({ result });
          const resultBody = JSON.parse(result.text);
          expect(resultBody.message).toEqual('Login successful!');
          expect(resultBody.playerID).toEqual(mockFirstPlayer.playerID);
          expect(resultBody.playerObjectID).toEqual(expect.any(String));
          expect(resultBody.username).toEqual(mockFirstPlayer.username);
          expect(result.status).toBe(200);
        });
    });
  });
});
