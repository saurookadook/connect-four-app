import { FlatRecord, HydratedDocument, Types } from 'mongoose';

import { GameSessionStatus } from '@/constants';
import { GameSessionDTO } from '@/game-engine/dtos/game-session.dto';
import {
  GameSession,
  GameSessionDocument,
} from '@/game-engine/schemas/game-session.schema';
import { mockNow } from './commonMocks';

const commonDefaults = {
  createdAt: mockNow,
  moves: [],
  status: GameSessionStatus.ACTIVE,
  updatedAt: mockNow,
};

type GameSessionDocumentMock = Pick<
  HydratedDocument<GameSession>,
  | '_id'
  | 'playerOneID'
  | 'playerTwoID'
  | 'moves'
  | 'status'
  | 'createdAt'
  | 'updatedAt'
  | '__v'
>;

type OptionalCommonDefaults = Partial<
  Pick<
    HydratedDocument<GameSession>,
    'createdAt' | 'moves' | 'status' | 'updatedAt'
  >
>;

type OptionalDocumentArgs = Partial<
  Pick<HydratedDocument<GameSession>, '_id' | '__v'>
>;

type RequiredDocumentArgs = Pick<
  HydratedDocument<GameSession>,
  'playerOneID' | 'playerTwoID'
>;

// TODO: this still isn't raising errors like it should when the 'args' includes
// additional properties other than what is defined in the types
export function createNewGameSessionDocumentMock(
  args: RequiredDocumentArgs & OptionalDocumentArgs & OptionalCommonDefaults,
): GameSessionDocumentMock {
  const { _id, __v, ...rest } = args;
  return {
    ...commonDefaults,
    ...rest,
    _id: _id ?? new Types.ObjectId(),
    __v: __v ?? 0,
  };
}

// TODO: need to fix types in this to be clearer like it is for above function
export function createNewGameSessionMock(
  args: Partial<GameSessionDTO>,
): Partial<GameSessionDTO> {
  return {
    ...commonDefaults,
    ...args,
  };
}
