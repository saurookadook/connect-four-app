import { GameSessionStatus } from '@/constants';
import { GameSessionDTO } from '@/game-engine/dtos/game-session.dto';

export function createNewGameSessionMock(args: Partial<GameSessionDTO>) {
  return {
    moves: [],
    status: GameSessionStatus.ACTIVE,
    ...args,
  };
}
