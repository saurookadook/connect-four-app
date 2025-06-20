import { randomUUID } from 'node:crypto';
import { inspect } from 'node:util';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ObjectId } from 'mongodb';
import { DataSource } from 'typeorm';

import { GameSessionStatus } from '@/constants';
import { DatabaseModule } from '@/database/database.module';
import { GameSession } from '@game-engine/session/game-session.entity';
import { GameSessionModule } from '@game-engine/session/game-session.module';
import { GameSessionService } from '@game-engine/session/game-session.service';

const mockFirstPlayerID = randomUUID();
const mockSecondPlayerID = randomUUID();
const mockThirdPlayerId = randomUUID();
const mockNow = new Date();
const mockGameSession = {
  playerOneID: mockFirstPlayerID,
  playerTwoID: mockSecondPlayerID,
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
        DatabaseModule,
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

  it("'findById' - should a game session document by ", async () => {
    const insertResult = await service.createOne({
      playerOneID: mockFirstPlayerID,
      playerTwoID: mockSecondPlayerID,
    });

    const foundGameSession = await service.findOneById(insertResult.insertedId);

    // NOTE: this doesn't pass because something about TypeOrm's column decoarators
    // aren't respecting settings like `default`, `nullable`, etc.
    expect(foundGameSession).toEqual(expect.objectContaining(mockGameSession));
  });

  it("'findAllForPlayer' - should insert a new game session document", async () => {
    const insertResultOne = await service.createOne({
      playerOneID: mockFirstPlayerID,
      playerTwoID: mockSecondPlayerID,
    });
    const insertResultTwo = await service.createOne({
      playerOneID: mockThirdPlayerId,
      playerTwoID: mockFirstPlayerID,
    });

    const foundGameSessions = await service.findAllForPlayer(mockFirstPlayerID);

    expect(foundGameSessions).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          ...mockGameSession,
          _id: insertResultOne.insertedId,
        }),
        expect.objectContaining({
          ...mockGameSession,
          _id: insertResultTwo.insertedId,
          playerOneID: mockThirdPlayerId,
          playerTwoID: mockFirstPlayerID,
        }),
      ]),
    );
  });

  it("'createOne' - should insert a new game session document", async () => {
    const insertResult = await service.createOne({
      playerOneID: mockFirstPlayerID,
      playerTwoID: mockSecondPlayerID,
    });

    // console.log({
    //   insertedIdType: typeof insertResult.insertedId,
    //   insertedIdInstanceOf: insertResult.insertedId instanceof ObjectId,
    // });

    expect(insertResult).toEqual(
      expect.objectContaining({
        acknowledged: true,
        insertedId: expect.any(ObjectId),
      }),
    );
  });
});
