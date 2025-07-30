import { INestApplication } from '@nestjs/common';
import { getConnectionToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Connection, Model } from 'mongoose';
import request from 'supertest';
import type { App } from 'supertest/types';

import { mockFirstPlayer, mockSecondPlayer } from '@/__mocks__/playerMocks';
import { PLAYER_MODEL_TOKEN } from '@/constants';
import { DatabaseModule } from '@/database/database.module';
import { applyGlobalSessionMiddleware } from '@/middleware/session.middleware';
import { Player } from '@/players/schemas/player.schema';
import { AuthModule } from './auth.module';
import { AuthenticationService } from './authentication.service';

describe('AuthController', () => {
  let app: INestApplication<App>;
  let mongoConnection: Connection;
  let service: AuthenticationService;
  let model: Model<Player>;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        DatabaseModule, // force formatting
        AuthModule,
      ],
    }).compile();

    app = module.createNestApplication();
    applyGlobalSessionMiddleware(app);

    await app.init();

    mongoConnection = await app.resolve(getConnectionToken());
    service = await app.resolve(AuthenticationService);
    model = await app.resolve(PLAYER_MODEL_TOKEN);
  });

  afterAll(async () => {
    await model.deleteMany({}).exec();
    await mongoConnection.close();
    jest.useRealTimers();
  });

  describe('/auth/register (POST)', () => {
    beforeEach(async () => {
      await model.deleteMany({}).exec();
      jest.clearAllTimers();
    });

    it('should register a new player', (done) => {
      request(app.getHttpServer())
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
          expect(resultBody.playerID).toBeUUID();
          expect(resultBody.playerObjectID).toEqual(expect.any(String));
          expect(resultBody.username).toEqual(mockFirstPlayer.username);
          expect(result.status).toBe(201);
        })
        .end(done);
    });
  });

  describe('/auth/login (POST)', () => {
    beforeEach(async () => {
      await model.deleteMany({}).exec();
      jest.clearAllTimers();

      await service.register({
        username: mockSecondPlayer.username,
        unhashedPassword: mockSecondPlayer.unhashedPassword,
      });
    });

    it('should log in an existing player', (done) => {
      request(app.getHttpServer())
        .post('/auth/login')
        .send({
          username: mockSecondPlayer.username,
          password: mockSecondPlayer.unhashedPassword,
        })
        .set('Accept', 'application/json')
        .expect((result) => {
          // console.log({ result });
          const resultBody = JSON.parse(result.text);
          expect(resultBody.message).toEqual('Login successful!');
          expect(resultBody.playerID).toBeUUID();
          expect(resultBody.playerObjectID).toEqual(expect.any(String));
          expect(resultBody.username).toEqual(mockSecondPlayer.username);
          expect(result.status).toBe(201);
        })
        .end(done);
    });
  });
});
