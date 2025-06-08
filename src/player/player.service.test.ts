import { randomUUID } from 'node:crypto';
import { Test, TestingModule } from '@nestjs/testing';
import { getConnectionToken } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';

import { PLAYER_MODEL_TOKEN } from '@/constants/db';
import { databaseProviders } from '@/database/database.providers';
import { Player, PlayerDocument } from '@/player/schemas/player.schema';
import { PlayerModule } from '@/player/player.module';
import { PlayerService } from '@/player/player.service';
import { expectHydratedDocumentToMatch } from '@/utils/testing';

const mockPlayerID = randomUUID();
const mockNow = new Date();
const mockPlayer = {
  playerID: mockPlayerID,
  createdAt: mockNow,
  updatedAt: mockNow,
};

describe('PlayerService', () => {
  let mongoConnection: Connection;
  let service: PlayerService;
  let model: Model<Player>;

  beforeAll(async () => {
    jest.useFakeTimers({
      doNotFake: ['nextTick', 'setImmediate'],
      now: mockNow,
    });

    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ...databaseProviders, // force formatting
        PlayerModule,
      ],
    }).compile();

    mongoConnection = await module.resolve(getConnectionToken());
    service = await module.resolve(PlayerService);
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

  describe("'createOne' method", () => {
    it('should insert a new player document', async () => {
      const newPlayer = await service.createOne({
        playerID: mockPlayerID,
      });

      expectHydratedDocumentToMatch<Player>(newPlayer, {
        ...mockPlayer,
      });
    });
  });

  describe("'findOneById' method", () => {
    let initialPlayer: PlayerDocument;

    beforeEach(async () => {
      initialPlayer = await service.createOne({
        playerID: mockPlayerID,
      });
    });

    it('should find a player document by ', async () => {
      const foundPlayer = await service.findOneById(
        initialPlayer._id.toString(),
      );

      expectHydratedDocumentToMatch<Player>(foundPlayer as PlayerDocument, {
        ...mockPlayer,
      });
    });
  });

  describe("'findOneByPlayerID' method", () => {
    let initialPlayer: PlayerDocument;

    beforeEach(async () => {
      initialPlayer = await service.createOne({
        playerID: mockPlayerID,
      });
    });

    it('should find a player document by playerID', async () => {
      const foundPlayer = await service.findOneByPlayerID(
        initialPlayer.playerID,
      );

      expectHydratedDocumentToMatch<Player>(foundPlayer as PlayerDocument, {
        ...mockPlayer,
      });
    });
  });

  describe("'updateOne' method", () => {
    let initialPlayer: PlayerDocument;

    beforeEach(async () => {
      initialPlayer = await service.createOne({
        playerID: mockPlayerID,
      });
    });

    it('should update a player document', async () => {
      const updatedFields = {
        username: 'RickSanchez',
        email: 'im-a-pickle@gmail.com',
      };
      const updatedPlayer = await service.updateOne(
        initialPlayer._id.toString(),
        updatedFields,
      );

      expectHydratedDocumentToMatch<Player>(updatedPlayer as PlayerDocument, {
        ...mockPlayer,
        ...updatedFields,
      });
    });
  });

  describe("'deleteOneById' method", () => {
    let initialPlayer: PlayerDocument;

    beforeEach(async () => {
      initialPlayer = await service.createOne({
        playerID: mockPlayerID,
      });
    });

    it('should delete a player document', async () => {
      expectHydratedDocumentToMatch<Player>(initialPlayer, {
        ...mockPlayer,
      });

      const initialID = initialPlayer._id.toString();
      const deletedPlayer = await service.deleteOneById(initialID);

      expectHydratedDocumentToMatch(deletedPlayer as PlayerDocument, {
        ...mockPlayer,
      });

      const emptyResult = await service.findOneById(initialID);
      expect(emptyResult).toBeNull();
    });
  });
});
