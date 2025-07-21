import { Types } from 'mongoose';

import { PlayerDTO } from '@/player/dtos/player.dto';

export type PlayerDetails = {
  playerID: PlayerID;
  playerObjectID: Types.ObjectId;
  username: PlayerDTO['username'];
};
