import { UUID } from 'crypto';
import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { ObjectId } from 'mongodb';
import { v4 as uuidv4 } from 'uuid';

import { PlayerDocument } from '@/player/schemas/player.schema';
import { PlayerService } from '@/player/player.service';
import { RegisterDTO, LoginDTO } from './dtos/auth.dto';

export type AuthenticationResult = {
  message: string;
  statusCode: number;
};

export type AuthenticationSuccessResult = AuthenticationResult & {
  playerID: UUID;
  playerObjectID: ObjectId; // MongoDB ObjectId
  username: string;
};

export type AuthenticationErrorResult = AuthenticationResult & {
  // TODO: other stuff?
};

@Injectable()
export class AuthenticationService {
  static readonly SALT_ROUNDS = 10;

  constructor(private playerService: PlayerService) {}

  async register(
    registrationData: RegisterDTO,
  ): Promise<AuthenticationSuccessResult> {
    // TODO: validate username and password?
    const salt = await bcrypt.genSalt(AuthenticationService.SALT_ROUNDS);
    const passwordHash = await bcrypt.hash(
      registrationData.unhashedPassword,
      salt,
    );
    const newPlayer = await this.playerService.createOne({
      username: registrationData.username,
      password: passwordHash,
      playerID: uuidv4() as UUID,
      email: registrationData.email,
    });

    return this._formSuccessResponse({
      message: 'Registration successful!',
      player: newPlayer,
      statusCode: 202,
    });
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

    return this._formSuccessResponse({
      message: 'Login successful!',
      player: player,
      statusCode: 202,
    });
  }

  async logout(playerID: string): Promise<string> {
    // Invalidate the player's session (implementation depends on your auth strategy)
    return new Promise((resolve) => resolve('Logout successful!'));
  }

  _formSuccessResponse({
    message,
    player,
    statusCode,
  }: {
    message: string;
    player: PlayerDocument;
    statusCode: number;
  }) {
    return {
      message,
      playerID: player.playerID,
      playerObjectID: player._id,
      statusCode,
      username: player.username,
    };
  }
}
