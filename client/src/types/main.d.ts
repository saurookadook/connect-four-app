import { AppDispatch } from '@/store';
import { PlayerID } from '@connect-four-app/shared';

export type BoundThis = {
  name: string;
};

export type BaseAction = {
  dispatch: AppDispatch;
};

export type GameSessionsItem = {
  id: string;
  status: GameSessionStatus;
  playerOneID: PlayerID;
  playerOneUsername: string;
  playerTwoID: PlayerID;
  playerTwoUsername: string;
};

export type AppParams = {
  gameSessionID?: string;
  subPage?: string;
};

export type RouterParams = ReturnType<typeof useParams<AppParams>>;

export type MatchmakingPlayersData = {
  playerID: PlayerID;
  username: string;
};
