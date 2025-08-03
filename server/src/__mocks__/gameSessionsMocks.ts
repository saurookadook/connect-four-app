import { HydratedDocument, Types } from 'mongoose';

import { GameSessionStatus } from '@connect-four-app/shared';
import { GameSessionDTO } from '@/game-engine/dtos/game-session.dto';
import { GameSession } from '@/game-engine/schemas/game-session.schema';
import { mockNow } from './commonMocks';

const commonDefaults = {
  createdAt: mockNow,
  moves: [],
  status: GameSessionStatus.ACTIVE,
  winner: null,
  updatedAt: mockNow,
};

// prettier-ignore
export type GameSessionDocumentMock =
  { _id?: HydratedDocument<GameSession>['_id']; } &
  Pick<
    HydratedDocument<GameSession>,
    | 'playerOneID'
    | 'playerTwoID'
    | 'moves'
    | 'status'
    | 'winner'
    | 'createdAt'
    | 'updatedAt'
    | '__v'
  >;

export type OptionalDocumentMockArgs = Partial<
  Pick<
    HydratedDocument<GameSession>,
    '_id' | 'createdAt' | 'moves' | 'status' | 'winner' | 'updatedAt' | '__v'
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
  const { __v, ...rest } = args;
  return {
    ...commonDefaults,
    ...rest,
    __v: __v ?? 0,
  };
}

// prettier-ignore
export type GameSessionMock =
  { id?: GameSessionDTO['id'] } &
  Pick<
    GameSessionDTO,
    | 'playerOneID' // force formatting
    | 'playerOneUsername'
    | 'playerTwoID'
    | 'playerTwoUsername'
    | 'moves'
    | 'status'
    | 'createdAt'
    | 'updatedAt'
  >;

export type OptionalMockArgs = Partial<
  Pick<
    GameSessionDTO,
    | 'id'
    | 'createdAt'
    | 'moves'
    | 'playerOneUsername'
    | 'playerTwoUsername'
    | 'status'
    | 'updatedAt'
  >
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
    playerOneUsername: args.playerOneUsername ?? 'playerOneUsername',
    playerTwoUsername: args.playerTwoUsername ?? 'playerTwoUsername',
  };
}
