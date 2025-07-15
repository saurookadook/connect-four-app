import { AppDispatch } from '@/store';

export type Nullable<T> = T | null;

export type BoundThis = {
  name: string;
};

export type BaseAction = {
  dispatch: AppDispatch;
};

// connect-four
export enum GameSessionStatus {
  ABANDONED = 'ABANDONED',
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
}

export type GameSessionsItem = {
  id: string;
  status: GameSessionStatus;
  playerOneID: string;
  playerTwoID: string;
};

export type AppParams = {
  gameSessionID?: string;
  subPage?: string;
};

export type RouterParams = ReturnType<typeof useParams<AppParams>>;
