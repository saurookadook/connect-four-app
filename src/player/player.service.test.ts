import { randomUUID } from 'node:crypto';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { MongooseModule, getConnectionToken } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';
import { Connection, Model } from 'mongoose';

import baseConfig, { buildConnectionURI } from '@/config';
import { Player, PlayerDocument } from '@/player/schemas/player.schema';

const mockNow = new Date();

describe('PlayersService', () => {
  beforeAll(() => {
    jest.useFakeTimers({
      doNotFake: ['nextTick', 'setImmediate'],
      now: mockNow,
    });
  });

  describe("'createOne' method", () => {
    it('TODO', () => {
      expect('Implement me!').toBe(false);
    });
  });

  describe("'findOneById' method", () => {
    it('TODO', () => {
      expect('Implement me!').toBe(false);
    });
  });

  describe("'updateOne' method", () => {
    it('TODO', () => {
      expect('Implement me!').toBe(false);
    });
  });

  describe("'deleteOneById' method", () => {
    it('TODO', () => {
      expect('Implement me!').toBe(false);
    });
  });
});
