import { AppDispatch } from '@/store';

export type Nullable<T> = T | null;

export type BoundThis = {
  name: string;
};

export type Message = {
  content: string;
  id: string;
  sender: 'client' | 'server';
  timestamp: number;
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
