import { UUID } from 'crypto';
import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

import { PlayerDocument } from '@/player/schemas/player.schema';
import { PlayerService } from '@/player/player.service';
import { RegisterDTO, LoginDTO } from './dtos/auth.dto';

const SALT_ROUNDS = 10;

export type AuthenticationResponse = {
  message: string;
};

export type AuthenticationSuccessResponse = AuthenticationResponse & {
  username: string;
};

export type AuthenticationErrorResponse = AuthenticationResponse & {
  // TODO:
  statusCode: number;
};

@Injectable()
export class AuthenticationService {
  constructor(private playerService: PlayerService) {}

  async register(registrationData: RegisterDTO): Promise<PlayerDocument> {
    // TODO: validate username and password?
    const passwordHash = await bcrypt.hash(
      registrationData.unhashedPassword,
      SALT_ROUNDS,
    );
    const playerID = uuidv4() as UUID;
    const newPlayer = await this.playerService.createOne({
      username: registrationData.username,
      password: passwordHash,
      playerID,
      email: registrationData.email,
    });

    return newPlayer;
  }

  async login(credentials: LoginDTO): Promise<PlayerDocument | null> {
    // const player = await this.playerService.findOneByUsername(
    //   credentials.username,
    // );
    // if (player && player.password === credentials.password) {
    //   return player;
    // }

    return null;
  }

  async logout(playerID: string): Promise<string> {
    // Invalidate the player's session (implementation depends on your auth strategy)
    return 'Player logged out successfully';
  }
}
