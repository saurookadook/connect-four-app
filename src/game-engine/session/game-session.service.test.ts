import { randomUUID } from 'node:crypto';
import { inspect } from 'node:util';
import { INestApplication } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ObjectId } from 'mongodb';
import { DataSource } from 'typeorm';

import baseConfig from '@/config/base.config';
import { GameSessionStatus } from '@/constants';
import { GameSession } from '@game-engine/session/game-session.entity';
import { GameSessionModule } from '@game-engine/session/game-session.module';
import { GameSessionService } from '@game-engine/session/game-session.service';

const mockPlayerOneID = randomUUID();
const mockPlayerTwoID = randomUUID();
const mockNow = new Date();
const mockGameSession = {
  playerOneID: mockPlayerOneID,
  playerTwoID: mockPlayerTwoID,
  moves: [],
  status: GameSessionStatus.ACTIVE,
  createdAt: mockNow,
  updatedAt: mockNow,
};

describe('GameSessionService', () => {
  let app: INestApplication;
  let dataSource: DataSource;
  let service: GameSessionService;

  beforeAll(async () => {
    jest.useFakeTimers({
      doNotFake: ['nextTick', 'setImmediate'],
      now: mockNow,
    });
    const module = await Test.createTestingModule({
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
              entities: [__dirname + '/**/*.entity{.ts,.js}'],
              synchronize: true,
            };
          },
          inject: [ConfigService],
        }),
        TypeOrmModule.forFeature([GameSession]),
        GameSessionModule,
      ],
    }).compile();

    app = module.createNestApplication();
    await app.listen(3333);

    dataSource = await app.resolve(DataSource);
    service = await app.resolve(GameSessionService);
  });

  afterAll(async () => {
    await dataSource.dropDatabase();
    await dataSource.destroy();
    await app.close();
    jest.useRealTimers();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should insert a new game session document', async () => {
    const insertResult = await service.createOne({
      playerOneID: mockPlayerOneID,
      playerTwoID: mockPlayerTwoID,
    });

    console.log({
      insertedIdType: typeof insertResult.insertedId,
      insertedIdInstanceOf: insertResult.insertedId instanceof ObjectId,
    });

    expect(insertResult).toEqual(
      expect.objectContaining({
        acknowledged: true,
        insertedId: expect.any(ObjectId),
      }),
    );
  });
});
