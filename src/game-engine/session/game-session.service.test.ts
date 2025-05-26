import { randomUUID } from 'node:crypto';
import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
// import { Model } from 'mongoose';

import { GameSessionStatus } from '@/constants';
import { GameSession } from '@game-engine/schemas/game-session.schema';
import { GameSessionService } from '@game-engine/session/game-session.service';

const mockPlayerOneID = randomUUID();
const mockPlayerTwoID = randomUUID();
const mockGameSession = {
  playerOneID: mockPlayerOneID,
  playerTwoID: mockPlayerTwoID,
  moves: [],
  status: GameSessionStatus.ACTIVE,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const GAME_SESSION_MODEL_TOKEN = getModelToken(GameSession.name);

describe('GameSessionService', () => {
  let service: GameSessionService;
  // let model: Model<GameSession>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GameSessionService,
        {
          provide: GAME_SESSION_MODEL_TOKEN,
          useValue: {
            new: jest.fn().mockResolvedValue(mockGameSession),
            constructor: jest.fn().mockResolvedValue(mockGameSession),
            find: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            exec: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get(GameSessionService);
    // model = module.get<Model<GameSession>>(GAME_SESSION_MODEL_TOKEN);
  });

  it('should insert a new game session document', async () => {
    const newGameSession = await service.createOne({
      playerOneID: mockPlayerOneID,
      playerTwoID: mockPlayerTwoID,
    });

    expect(newGameSession).toEqual(mockGameSession);
  });
});
