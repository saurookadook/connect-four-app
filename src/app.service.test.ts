import { Test, TestingModule } from '@nestjs/testing';

import { AppService } from './app.service';

describe('AppService', () => {
  let appService: AppService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [AppService],
    }).compile();

    appService = app.get<AppService>(AppService);
  });

  describe('gameType', () => {
    it('should return "Connect Four"', () => {
      expect(appService.gameType).toBe('Connect Four');
    });

    it('should be read-only', () => {
      // // @ts-expect-error: Specifically testing a value can't be assigned
      // appService.gameType = 'New Game Type';
      expect(() => {
        // @ts-expect-error: Specifically testing a value can't be assigned
        appService.gameType = 'New Game Type';
      }).toThrow(
        'Cannot set property gameType of #<AppService> which has only a getter',
      );
    });
  });

  describe('getHello', () => {
    it('should return "Hello World!"', () => {
      expect(appService.getHello()).toBe('Hello World!');
    });
  });
});
