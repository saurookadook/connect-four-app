import { randomUUID } from 'node:crypto';
import { Test, TestingModule } from '@nestjs/testing';
import { reduce } from 'rxjs/operators';

import { PlayerMove } from '@/constants/game';
import { GameEventsGateway } from '@/game-engine/events/game-events.gateway';

describe('GameEventsGateway', () => {
  const mockPlayerOneID = randomUUID();
  const mockPlayerTwoID = randomUUID();
  let gateway: GameEventsGateway;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GameEventsGateway],
    }).compile();

    gateway = module.get(GameEventsGateway);
  });

  describe('move', () => {
    it('should return passed data', async () => {
      const firstTimestamp = new Date();
      const secondTimestamp = new Date(firstTimestamp.getTime() + 2000);

      const firstCall = await gateway.onEvent({
        columnIndex: 1,
        playerID: mockPlayerOneID,
        timestamp: firstTimestamp,
      } as PlayerMove);

      firstCall
        .pipe(reduce((acc, item) => [...acc, item], []))
        .subscribe((results) => {
          expect(results).toHaveLength(1);
          results.forEach((result, index) => {
            expect(result.data.columnIndex).toBe(1);
            expect(result.data.playerID).toBe(mockPlayerOneID);
            expect(result.data.timestamp).toBe(firstTimestamp);
          });
        });

      const secondCall = await gateway.onEvent({
        columnIndex: 2,
        playerID: mockPlayerTwoID,
        timestamp: secondTimestamp,
      } as PlayerMove);

      secondCall
        .pipe(reduce((acc, item) => [...acc, item], []))
        .subscribe((results) => {
          expect(results).toHaveLength(1);
          results.forEach((result, index) => {
            expect(result.data.columnIndex).toBe(2);
            expect(result.data.playerID).toBe(mockPlayerTwoID);
            expect(result.data.timestamp).toBe(secondTimestamp);
          });
        });
    });
  });
});
