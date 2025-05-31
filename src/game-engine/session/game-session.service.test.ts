import { randomUUID } from 'node:crypto';
import { inspect } from 'node:util';
import { INestApplication, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';

import baseConfig from '@/config/base.config';
import { GameSessionStatus } from '@/constants';
import { GameSession } from '@game-engine/session/game-session.entity';
import { GameSessionModule } from '@game-engine/session/game-session.module';
import { GameSessionService } from '@game-engine/session/game-session.service';
import { createMockModel } from '@/utils/test-helpers';

const mockPlayerOneID = randomUUID();
const mockPlayerTwoID = randomUUID();
const mockNow = new Date();
const mockGameSession = {
  playerOneID: mockPlayerOneID,
  playerTwoID: mockPlayerTwoID,
  moves: [],
  status: GameSessionStatus.ACTIVE,
  createdAt: new Date(),
  updatedAt: new Date(),
};

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: process.env.NODE_ENV === 'test' ? '.env.test' : '.env',
      isGlobal: true,
      load: [baseConfig],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        console.log({
          name: 'GameSessionService.useFactory',
          database: configService.get('database.dbName'),
          host: configService.get('database.host'),
          port: configService.get('database.port'),
        });

        return {
          type: 'mongodb',
          database: configService.get('database.dbName'),
          host: configService.get('database.host'),
          port: configService.get('database.port'),
          synchronize: true,
        };
      },
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([GameSession]),
  ],
  providers: [
    GameSessionService,
    {
      provide: getRepositoryToken(GameSession),
      useClass: MongoRepository,
    },
  ],
})
export class GameSessionTestModule {}

describe('GameSessionService', () => {
  let app: INestApplication;
  let module: TestingModule;
  let service: GameSessionService;

  beforeAll(async () => {
    jest.useFakeTimers({
      now: mockNow,
    });
    // module = await Test.createTestingModule({
    //   imports: [
    //     ConfigModule.forRoot({
    //       envFilePath: process.env.NODE_ENV === 'test' ? '.env.test' : '.env',
    //       isGlobal: true,
    //       load: [baseConfig],
    //     }),
    //     TypeOrmModule.forRootAsync({
    //       imports: [ConfigModule],
    //       useFactory: (configService: ConfigService) => {
    //         console.log({
    //           name: 'GameSessionService.useFactory',
    //           database: configService.get('database.dbName'),
    //           host: configService.get('database.host'),
    //           port: configService.get('database.port'),
    //         });

    //         return {
    //           type: 'mongodb',
    //           database: configService.get('database.dbName'),
    //           host: configService.get('database.host'),
    //           port: configService.get('database.port'),
    //           synchronize: true,
    //         };
    //       },
    //       inject: [ConfigService],
    //     }),
    //     TypeOrmModule.forFeature([GameSession]),
    //   ],
    //   providers: [
    //     GameSessionService,
    //     {
    //       provide: getRepositoryToken(GameSession),
    //       useClass: MongoRepository,
    //     },
    //   ],
    // }).compile();

    app = await NestFactory.create(GameSessionTestModule);
    await app.init();

    service = app.get(GameSessionService);
    // service = module.get(GameSessionService);
  });

  afterAll(async () => {
    await app.close();
    // await module.close();
    jest.useRealTimers();
  });

  it('should insert a new game session document', async () => {
    const newGameSession = await service.createOne({
      playerOneID: mockPlayerOneID,
      playerTwoID: mockPlayerTwoID,
    });

    expect(newGameSession).toEqual(mockGameSession);
  });
});
