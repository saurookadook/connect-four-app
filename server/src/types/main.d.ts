import { Types } from 'mongoose';

import { type PlayerID } from '@connect-four-app/shared';
import { PlayerDTO } from '@/players/dtos/player.dto';

export type PlayerDetails = {
  playerID: PlayerID;
  playerObjectID: Types.ObjectId;
  username: PlayerDTO['username'];
};
