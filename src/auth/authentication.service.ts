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
    const passwordHash = await this._createPasswordHash(
      registrationData.unhashedPassword,
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
    const player = await this.validatePlayer({
      username: loginData.username,
      unhashedPassword: loginData.unhashedPassword,
    });

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

  async validatePlayer({
    username,
    unhashedPassword,
  }: {
    username: LoginDTO['username'];
    unhashedPassword: LoginDTO['unhashedPassword'];
  }) {
    const player = await this.playerService.findOneByUsername(username);

    if (
      player == null ||
      !(await bcrypt.compare(unhashedPassword, player.password))
    ) {
      throw new Error('Invalid username or password.');
    }

    return player;
  }

  async _createPasswordHash(unhashedPassword: string): Promise<string> {
    const salt = await bcrypt.genSalt(AuthenticationService.SALT_ROUNDS);
    return await bcrypt.hash(unhashedPassword, salt);
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
