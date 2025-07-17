import { Test, TestingModule } from '@nestjs/testing';
import { BoardStatesService } from './board-states.service';

describe('BoardStatesService', () => {
  let service: BoardStatesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BoardStatesService],
    }).compile();

    service = module.get<BoardStatesService>(BoardStatesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
