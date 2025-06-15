import { UUID } from 'crypto';
import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { ObjectId } from 'mongodb';
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
  playerObjectID: ObjectId; // MongoDB ObjectId
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
      playerObjectID: newPlayer._id,
      username: newPlayer.username,
    };
  }

  async login(
    loginData: LoginDTO,
  ): Promise<AuthenticationSuccessResult | AuthenticationErrorResult> {
    const player = await this.playerService.findOneByUsername(
      loginData.username,
    );

    if (
      player == null ||
      !(await bcrypt.compare(loginData.unhashedPassword, player.password))
    ) {
      return {
        message: 'Invalid username or password.',
        statusCode: 401,
      };
    }

    return {
      message: 'Login successful!',
      playerID: player.playerID,
      playerObjectID: player._id,
      username: player.username,
    };
  }

  async logout(playerID: string): Promise<string> {
    // Invalidate the player's session (implementation depends on your auth strategy)
    return new Promise((resolve) => resolve('Logout successful!'));
  }
}
