import { HydratedDocument, Types } from 'mongoose';

import { GameSessionStatus } from '@connect-four-app/shared';
import { GameSessionDTO } from '@/game-engine/dtos/game-session.dto';
import { GameSession } from '@/game-engine/schemas/game-session.schema';
import { mockNow } from './commonMocks';

const commonDefaults = {
  createdAt: mockNow,
  moves: [],
  status: GameSessionStatus.ACTIVE,
  updatedAt: mockNow,
};

export type GameSessionDocumentMock = Pick<
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

export type OptionalDocumentMockArgs = Partial<
  Pick<
    HydratedDocument<GameSession>,
    '_id' | 'createdAt' | 'moves' | 'status' | 'updatedAt' | '__v'
  >
>;

export type RequiredDocumentMockArgs = Pick<
  HydratedDocument<GameSession>,
  'playerOneID' | 'playerTwoID'
>;

// TODO: this still isn't raising errors like it should when the 'args' includes
// additional properties other than what is defined in the types
export function createNewGameSessionDocumentMock(
  args: RequiredDocumentMockArgs & OptionalDocumentMockArgs,
): GameSessionDocumentMock {
  const { _id, __v, ...rest } = args;
  return {
    ...commonDefaults,
    ...rest,
    _id: _id ?? new Types.ObjectId(),
    __v: __v ?? 0,
  };
}

// prettier-ignore
export type GameSessionMock =
  { id?: GameSessionDTO['id'] } &
  Pick<
    GameSessionDTO,
    | 'playerOneID' // force formatting
    | 'playerTwoID'
    | 'moves'
    | 'status'
    | 'createdAt'
    | 'updatedAt'
  >;

export type OptionalMockArgs = Partial<
  Pick<GameSessionDTO, 'id' | 'createdAt' | 'moves' | 'status' | 'updatedAt'>
>;

export type RequiredMockArgs = Pick<
  GameSessionDTO,
  'playerOneID' | 'playerTwoID'
>;

export function createNewGameSessionMock(
  args: RequiredMockArgs & OptionalMockArgs,
): GameSessionMock {
  return {
    ...commonDefaults,
    ...args,
  };
}
