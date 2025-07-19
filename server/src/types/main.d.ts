import { Types } from 'mongoose';

import { type PlayerID } from '@connect-four-app/shared';
import { PlayerDTO } from '@/player/dtos/player.dto';

export type { BoardCell, PlayerID, PlayerMove } from '@connect-four-app/shared';

export type PlayerDetails = {
  playerID: PlayerID;
  playerObjectID: Types.ObjectId;
  username: PlayerDTO['username'];
};
