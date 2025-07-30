import { randomUUID } from 'node:crypto';
import { Test, TestingModule } from '@nestjs/testing';
import { getConnectionToken } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';

import { sharedLog } from '@connect-four-app/shared';
import { mockPlayers } from '@/__mocks__/playerMocks';
import { PLAYER_MODEL_TOKEN } from '@/constants/db';
import { DatabaseModule } from '@/database/database.module';
import { expectHydratedDocumentToMatch } from '@/utils/testing';
import { Player, PlayerDocument } from './schemas/player.schema';
import { PlayersModule } from './players.module';
import { PlayersService } from './players.service';

const logger = sharedLog.getLogger('PlayersService__Tests');

const mockPlayerID = randomUUID();
const mockNow = new Date();
const mockPlayer = {
  playerID: mockPlayerID,
  username: 'MortySmith',
  password: 'wubbalubbadubdub',
  createdAt: mockNow,
  updatedAt: mockNow,
};

describe('PlayersService', () => {
  let mongoConnection: Connection;
  let playersService: PlayersService;
  let playerModel: Model<Player>;

  beforeAll(async () => {
    jest.useFakeTimers({
      doNotFake: ['nextTick', 'setImmediate'],
      now: mockNow,
    });

    const module: TestingModule = await Test.createTestingModule({
      imports: [
        DatabaseModule, // force formatting
        PlayersModule,
      ],
    }).compile();

    mongoConnection = await module.resolve(getConnectionToken());
    playersService = await module.resolve(PlayersService);
    playerModel = await module.resolve(PLAYER_MODEL_TOKEN);
  });

  afterEach(async () => {
    await playerModel.deleteMany({}).exec();
    jest.clearAllTimers();
  });

  afterAll(async () => {
    await playerModel.deleteMany({}).exec();
    await mongoConnection.close();
    jest.useRealTimers();
  });

  describe("'createOne' method", () => {
    it('should insert a new player document', async () => {
      const newPlayer = await playersService.createOne({
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
      initialPlayer = await playersService.createOne({
        playerID: mockPlayer.playerID,
        username: mockPlayer.username,
        password: mockPlayer.password,
      });
    });

    it('should find a player document by ', async () => {
      const foundPlayer = (await playersService.findOneById(
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
      initialPlayer = await playersService.createOne({
        playerID: mockPlayer.playerID,
        username: mockPlayer.username,
        password: mockPlayer.password,
      });
    });

    it('should find a player document by playerID', async () => {
      const foundPlayer = (await playersService.findOneByPlayerID(
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
      initialPlayer = await playersService.createOne({
        playerID: mockPlayer.playerID,
        username: mockPlayer.username,
        password: mockPlayer.password,
      });
    });

    it('should find a player document by username', async () => {
      const foundPlayer = (await playersService.findOneByUsername(
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

  describe("'findAll' method", () => {
    const [mockFirstPlayer, mockSecondPlayer, mockThirdPlayer] = mockPlayers;
    let testPlayers: PlayerDocument[];

    beforeEach(async () => {
      testPlayers = await Promise.all([
        playersService.createOne({
          playerID: mockPlayer.playerID,
          username: mockPlayer.username,
          password: mockPlayer.password,
        }),
        playersService.createOne(mockFirstPlayer),
        playersService.createOne(mockSecondPlayer),
        playersService.createOne(mockThirdPlayer),
      ]).then((results) =>
        results.sort(
          (a, b) =>
            Number(new Date(a.updatedAt) < new Date(b.updatedAt)) -
            Number(new Date(a.updatedAt) > new Date(b.updatedAt)),
        ),
      );
    });

    afterEach(async () => {
      await playerModel.deleteMany({}).exec();
    });

    it('should return all player documents without filters', async () => {
      const results = await playersService.findAll();

      expect(results).toHaveLength(testPlayers.length);

      testPlayers.forEach((expectedPlayer, index) => {
        const playerResult = results[index];

        expect(playerResult.playerID).toEqual(expectedPlayer.playerID);
        expect(playerResult.username).toEqual(expectedPlayer.username);
      });
    });

    it('should return all player documents with filters', async () => {
      const results = await playersService.findAll({
        filterOpts: {
          playerID: { $in: [testPlayers[1].playerID, testPlayers[2].playerID] },
        },
      });

      expect(results).toHaveLength(2);

      testPlayers.slice(1, 3).forEach((expectedPlayer, index) => {
        const playerResult = results[index];

        expect(playerResult.playerID).toEqual(expectedPlayer.playerID);
        expect(playerResult.username).toEqual(expectedPlayer.username);
      });
    });
  });

  describe("'updateOne' method", () => {
    let initialPlayer: PlayerDocument;

    beforeEach(async () => {
      initialPlayer = await playersService.createOne({
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
      const updatedPlayer = (await playersService.updateOne(
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
      initialPlayer = await playersService.createOne({
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
      const deletedPlayer = (await playersService.deleteOneById(
        initialID,
      )) as PlayerDocument;

      expectHydratedDocumentToMatch(
        deletedPlayer, // force formatting
        {
          ...mockPlayer,
        },
      );

      const emptyResult = await playersService.findOneById(initialID);
      expect(emptyResult).toBeNull();
    });
  });
});
