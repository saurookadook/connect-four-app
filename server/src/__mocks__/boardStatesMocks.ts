import { Types } from 'mongoose';

import { LogicBoard } from '@connect-four-app/shared';
import { mockNow } from './commonMocks';

export type BoardStateDocumentMock = {
  gameSessionID: Types.ObjectId;
  cells: ReturnType<typeof LogicBoard.createEmptyBoardState>;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
};

export function createBoardStateDocumentMock(
  gameSessionID: string,
): BoardStateDocumentMock {
  return {
    gameSessionID: new Types.ObjectId(gameSessionID),
    cells: LogicBoard.createEmptyBoardState(),
    createdAt: mockNow,
    updatedAt: mockNow,
    __v: 0,
  };
}
