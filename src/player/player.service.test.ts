import { randomUUID } from 'node:crypto';
import { Test, TestingModule } from '@nestjs/testing';
import { getConnectionToken } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';

import { PLAYER_MODEL_TOKEN } from '@/constants/db';
import { databaseProviders } from '@/database/database.providers';
import { expectHydratedDocumentToMatch } from '@/utils/testing';
import { Player, PlayerDocument } from './schemas/player.schema';
import { PlayerModule } from './player.module';
import { PlayerService } from './player.service';

const mockPlayerID = randomUUID();
const mockNow = new Date();
const mockPlayer = {
  playerID: mockPlayerID,
  username: 'MortySmith',
  password: 'wubbalubbadubdub',
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
        playerID: mockPlayer.playerID,
        username: mockPlayer.username,
        password: mockPlayer.password,
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
        playerID: mockPlayer.playerID,
        username: mockPlayer.username,
        password: mockPlayer.password,
      });
    });

    it('should find a player document by ', async () => {
      const foundPlayer = (await service.findOneById(
        initialPlayer._id.toString(),
      )) as PlayerDocument;

      expectHydratedDocumentToMatch<Player>(
        foundPlayer, // force formatting
        {
          ...mockPlayer,
        },
      );
    });
  });

  describe("'findOneByPlayerID' method", () => {
    let initialPlayer: PlayerDocument;

    beforeEach(async () => {
      initialPlayer = await service.createOne({
        playerID: mockPlayer.playerID,
        username: mockPlayer.username,
        password: mockPlayer.password,
      });
    });

    it('should find a player document by playerID', async () => {
      const foundPlayer = (await service.findOneByPlayerID(
        initialPlayer.playerID,
      )) as PlayerDocument;

      expectHydratedDocumentToMatch<Player>(
        foundPlayer, // force formatting
        {
          ...mockPlayer,
        },
      );
    });
  });

  describe("'findOneByUsername' method", () => {
    let initialPlayer: PlayerDocument;

    beforeEach(async () => {
      initialPlayer = await service.createOne({
        playerID: mockPlayer.playerID,
        username: mockPlayer.username,
        password: mockPlayer.password,
      });
    });

    it('should find a player document by username', async () => {
      const foundPlayer = (await service.findOneByUsername(
        initialPlayer.username,
      )) as PlayerDocument;

      expectHydratedDocumentToMatch<Player>(
        foundPlayer, // force formatting
        {
          ...mockPlayer,
        },
      );
    });
  });

  describe("'updateOne' method", () => {
    let initialPlayer: PlayerDocument;

    beforeEach(async () => {
      initialPlayer = await service.createOne({
        playerID: mockPlayer.playerID,
        username: mockPlayer.username,
        password: mockPlayer.password,
      });
    });

    it('should update a player document', async () => {
      const updatedFields = {
        username: 'RickSanchez',
        email: 'im-a-pickle@gmail.com',
      };
      const updatedPlayer = (await service.updateOne(
        initialPlayer._id.toString(),
        updatedFields,
      )) as PlayerDocument;

      expectHydratedDocumentToMatch<Player>(
        updatedPlayer, // force formatting
        {
          ...mockPlayer,
          ...updatedFields,
        },
      );
    });
  });

  describe("'deleteOneById' method", () => {
    let initialPlayer: PlayerDocument;

    beforeEach(async () => {
      initialPlayer = await service.createOne({
        playerID: mockPlayer.playerID,
        username: mockPlayer.username,
        password: mockPlayer.password,
      });
    });

    it('should delete a player document', async () => {
      expectHydratedDocumentToMatch<Player>(initialPlayer, {
        ...mockPlayer,
      });

      const initialID = initialPlayer._id.toString();
      const deletedPlayer = (await service.deleteOneById(
        initialID,
      )) as PlayerDocument;

      expectHydratedDocumentToMatch(
        deletedPlayer, // force formatting
        {
          ...mockPlayer,
        },
      );

      const emptyResult = await service.findOneById(initialID);
      expect(emptyResult).toBeNull();
    });
  });
});
