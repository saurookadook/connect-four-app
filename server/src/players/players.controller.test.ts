import { INestApplication } from '@nestjs/common';
import { getConnectionToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Connection, Model } from 'mongoose';
import request from 'supertest';
import { App } from 'supertest/types';

import { sharedLog } from '@connect-four-app/shared';
import { mockPlayers } from '@/__mocks__/playerMocks';
import { AuthModule } from '@/auth/auth.module';
import { GAME_SESSION_MODEL_TOKEN, PLAYER_MODEL_TOKEN } from '@/constants';
import { DatabaseModule } from '@/database/database.module';
import {
  CatchAllFilterProvider,
  HttpExceptionFilterProvider,
} from '@/filters/filters.providers';
import { Player, PlayerDocument } from '@/players/schemas/player.schema';
import { PlayersModule } from '@/players/players.module';
import { PlayersService } from '@/players/players.service';
import { expectSerializedDocumentToMatch } from '@/utils/testing';

const logger = sharedLog.getLogger('PlayersController__tests');

describe('PlayersController', () => {
  const [mockFirstPlayer, mockSecondPlayer, mockThirdPlayer] = mockPlayers;

  let app: INestApplication<App>;
  let mongoConnection: Connection;
  let playerModel: Model<Player>;
  let playersService: PlayersService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        DatabaseModule, // force formatting
        AuthModule,
        PlayersModule,
      ],
      providers: [CatchAllFilterProvider, HttpExceptionFilterProvider],
    }).compile();

    app = module.createNestApplication();

    await app.init();

    mongoConnection = await app.resolve(getConnectionToken());
    playerModel = await app.resolve(PLAYER_MODEL_TOKEN);
    playersService = await app.resolve(PlayersService);
  });

  afterEach(async () => {
    await playerModel.deleteMany({}).exec();
    jest.clearAllTimers();
  });

  afterAll(async () => {
    await playerModel.deleteMany({}).exec();
    await mongoConnection.close();
    await app.close();
    jest.useRealTimers();
  });

  describe('/players/:playerID (GET)', () => {
    beforeEach(async () => {
      await playerModel.insertMany([
        mockFirstPlayer,
        mockSecondPlayer,
        mockThirdPlayer,
      ]);
    });

    afterEach(async () => {
      await playerModel.deleteMany({}).exec();
    });

    it("should get a player document given a 'playerID'", async () => {
      await request(app.getHttpServer())
        .get(`/players/${mockFirstPlayer.playerID}`)
        .expect((result) => {
          const resultBody = JSON.parse(result.text);

          expect(resultBody.player).not.toBeNullish();
          expectSerializedDocumentToMatch<Player>(
            resultBody.player, // force formatting
            {
              ...mockFirstPlayer,
            },
          );
        });
    });

    it("should respond with error details if no player document can be found for a given 'playerID'", async () => {
      const randomUUID = '454d91b9-bace-4a0f-bcdb-e74afbf8ccf6';

      await request(app.getHttpServer())
        .get(`/players/${randomUUID}`)
        .expect((result) => {
          const resultBody = JSON.parse(result.text);

          expect(resultBody.message).toBeStringIncluding(
            `Could not find 'player' with ID '${randomUUID}'.`,
          );
          expect(resultBody.statusCode).toBe(404);
        });
    });

    it("should respond with validation error if 'playerID' path param is not a valid UUID", async () => {
      const invalidPlayerID = 'woops';

      await request(app.getHttpServer())
        .get(`/players/${invalidPlayerID}`)
        .expect((result) => {
          const resultBody = JSON.parse(result.text);

          expect(resultBody.message).toBeStringIncluding(
            'Validation failed (uuid is expected)',
          );
          expect(resultBody.statusCode).toBe(400);
        });
    });
  });

  describe('/players/all (GET)', () => {
    let testPlayers: PlayerDocument[];

    beforeEach(async () => {
      testPlayers = await Promise.all([
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

    it('should get all player documents', async () => {
      await request(app.getHttpServer())
        .get(`/players/all`)
        .expect((result) => {
          const resultBody = JSON.parse(result.text);

          expect(resultBody.playersData).not.toBeNullish();
          expect(resultBody.playersData).toHaveLength(3);

          testPlayers.forEach((expectedPlayer, index) => {
            const playerFromResult = resultBody.playersData[index];

            expect(playerFromResult.playerID).toEqual(expectedPlayer.playerID);
            expect(playerFromResult.username).toEqual(expectedPlayer.username);
          });
        });
    });

    it("should get all player documents excluding one with the given 'currentPlayerID' search param", async () => {
      await request(app.getHttpServer())
        .get(`/players/all?currentPlayerID=${mockSecondPlayer.playerID}`)
        .expect((result) => {
          const resultBody = JSON.parse(result.text);

          expect(resultBody.playersData).not.toBeNullish();
          expect(resultBody.playersData).toHaveLength(2);

          testPlayers
            .filter((player) => player.playerID !== mockSecondPlayer.playerID)
            .forEach((expectedPlayer, index) => {
              const playerFromResult = resultBody.playersData[index];

              expect(playerFromResult.playerID).toEqual(
                expectedPlayer.playerID,
              );
              expect(playerFromResult.username).toEqual(
                expectedPlayer.username,
              );
            });
        });
    });

    it('should return empty array if no player documents can be found', async () => {
      await playerModel.deleteMany({}).exec();

      await request(app.getHttpServer())
        .get(`/players/all`)
        .expect((result) => {
          const resultBody = JSON.parse(result.text);

          expect(resultBody.playersData).not.toBeNullish();
          expect(resultBody.playersData).toHaveLength(0);
        });
    });

    // TODO: maybe hold off on this until there are more filters?
    it.skip('should return empty array if no player documents can be found for given search criteria', async () => {
      await request(app.getHttpServer())
        .get(`/players/all?something=what`)
        .expect((result) => {
          const resultBody = JSON.parse(result.text);

          expect(resultBody.playersData).not.toBeNullish();
          expect(resultBody.playersData).toHaveLength(0);
        });
    });

    it("should respond with validation error if 'currentPlayerID' query param is not a valid UUID", async () => {
      const invalidPlayerID = 'woops';

      await request(app.getHttpServer())
        .get(`/players/all?currentPlayerID=${invalidPlayerID}`)
        .expect((result) => {
          const resultBody = JSON.parse(result.text);

          expect(resultBody.message).toBeStringIncluding(
            'Validation failed (uuid is expected)',
          );
          expect(resultBody.statusCode).toBe(400);
        });
    });
  });
});
