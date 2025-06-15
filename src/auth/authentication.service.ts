import { UUID } from 'crypto';
import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

import { PlayerDocument } from '@/player/schemas/player.schema';
import { PlayerService } from '@/player/player.service';
import { RegisterDTO, LoginDTO } from './dtos/auth.dto';

const SALT_ROUNDS = 10;

export type AuthenticationResult = {
  message: string;
};

export type AuthenticationSuccessResult = AuthenticationResult & {
  playerID: UUID;
  playerObjectID: string; // MongoDB ObjectId
  username: string;
};

export type AuthenticationErrorResult = AuthenticationResult & {
  // TODO: other stuff?
  statusCode: number;
};

@Injectable()
export class AuthenticationService {
  constructor(private playerService: PlayerService) {}

  async register(
    registrationData: RegisterDTO,
  ): Promise<AuthenticationSuccessResult> {
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

    return {
      message: 'Registration successful!',
      playerID: newPlayer.playerID,
      playerObjectID: newPlayer._id.toString(),
      username: newPlayer.username,
    };
  }

  async login(loginData: LoginDTO): Promise<AuthenticationSuccessResult> {
    // const player = await this.playerService.findOneByUsername(
    //   loginData.username,
    // );
    // if (player && player.password === loginData.password) {
    //   return player;
    // }

    return {
      message: 'Login successful!',
      // TEMP
      playerID: uuidv4() as UUID,
      playerObjectID: 'TODO',
      username: 'TODO',
    };
  }

  async logout(playerID: string): Promise<string> {
    // Invalidate the player's session (implementation depends on your auth strategy)
    return 'Player logged out successfully';
  }
}
