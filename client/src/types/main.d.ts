import { AppDispatch } from '@/store';

export type BoundThis = {
  name: string;
};

export type BaseAction = {
  dispatch: AppDispatch;
};

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
