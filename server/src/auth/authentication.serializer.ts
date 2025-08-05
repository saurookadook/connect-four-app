import { inspect } from 'node:util';
import { Injectable, NotFoundException } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';

import {
  sharedLog, // force formatting
  type Nullable,
} from '@connect-four-app/shared';
import { AuthenticationService } from '@/auth/authentication.service';
import { PlayersService } from '@/players/players.service';
import type { PlayerDetails } from '@/types/main';

const logger = sharedLog.getLogger('AuthenticationSerializer');

@Injectable()
export class AuthenticationSerializer extends PassportSerializer {
  constructor(
    private readonly authenticationService: AuthenticationService,
    private readonly playersService: PlayersService,
  ) {
    super();
  }

  serializeUser(
    player: { _id?: PlayerDetails['playerObjectID'] } & PlayerDetails, // force formatting
    done: (
      err: Nullable<Error>, // force formatting
      player: PlayerDetails,
    ) => void,
  ) {
    const authenticatedPlayerData = {
      playerID: player.playerID,
      playerObjectID: player._id ?? player.playerObjectID,
      username: player.username,
    };

    logger.debug(
      `[${this.serializeUser.name} method]\n`,
      inspect(
        {
          player,
          authenticatedPlayerData,
        },
        { colors: true, compact: false, depth: 2 },
      ),
    );

    process.nextTick(function () {
      return done(null, authenticatedPlayerData);
    });
  }

  async deserializeUser(
    payload: PlayerDetails, // force formatting
    done: (
      err: Nullable<Error>, // force formatting
      player: PlayerDetails,
    ) => void,
  ) {
    const player = await this.playersService.findOneByPlayerID(
      payload.playerID,
    );
    if (player == null) {
      throw new NotFoundException(
        `[${this.deserializeUser.name}] Player not found for 'playerID': '${payload.playerID}'`,
      );
    }

    logger.debug(
      `[${this.deserializeUser.name} method]\n`,
      inspect(
        {
          payload,
          player,
        },
        { colors: true, compact: false, depth: 2 },
      ),
    );

    process.nextTick(function () {
      return done(null, {
        playerID: player.playerID,
        playerObjectID: player._id,
        username: player.username,
      });
    });
  }
}
