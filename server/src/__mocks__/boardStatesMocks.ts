import { Types } from 'mongoose';

import { LogicBoard } from '@/game-logic-engine';
import { mockNow } from './commonMocks';

export type BoardStateDocumentMock = {
  gameSessionID: Types.ObjectId;
  state: ReturnType<typeof LogicBoard.createEmptyBoardState>;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
};

export function createBoardStateDocumentMock(
  gameSessionID: string,
): BoardStateDocumentMock {
  return {
    gameSessionID: new Types.ObjectId(gameSessionID),
    state: LogicBoard.createEmptyBoardState(),
    createdAt: mockNow,
    updatedAt: mockNow,
    __v: 0,
  };
}
