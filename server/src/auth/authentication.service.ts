import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

import { type PlayerID } from '@connect-four-app/shared';
import { PlayerDocument } from '@/players/schemas/player.schema';
import { PlayersService } from '@/players/players.service';
import { PlayerDetails } from '@/types/main';
import { RegisterDTO, LoginDTO } from './dtos/auth.dto';

export type AuthenticationResult = {
  message: string;
  statusCode: number;
};

export type AuthenticationSuccessResult = AuthenticationResult & PlayerDetails;

export type AuthenticationErrorResult = AuthenticationResult & {
  // TODO: better control error result in error response?
};

@Injectable()
export class AuthenticationService {
  static readonly SALT_ROUNDS = 10;

  constructor(private playersService: PlayersService) {}

  async register(
    registrationData: RegisterDTO,
  ): Promise<AuthenticationSuccessResult> {
    // TODO: validate username and password?
    const passwordHash = await AuthenticationService.createPasswordHash(
      registrationData.unhashedPassword,
    );
    const newPlayer = await this.playersService.createOne({
      username: registrationData.username,
      password: passwordHash,
      playerID: uuidv4() as PlayerID,
      email: registrationData.email,
    });

    return this._formSuccessResponse({
      message: 'Registration successful!',
      player: newPlayer,
      statusCode: 202,
    });
  }

  async login(loginData: LoginDTO): Promise<AuthenticationSuccessResult> {
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
    const player = await this.playersService.findOneByUsername(username);

    if (
      player == null ||
      !(await bcrypt.compare(unhashedPassword, player.password))
    ) {
      throw new Error('Invalid username or password.');
    }

    return player;
  }

  static createPasswordHashSync(unhashedPassword: string): string {
    const salt = bcrypt.genSaltSync(AuthenticationService.SALT_ROUNDS);
    return bcrypt.hashSync(unhashedPassword, salt);
  }

  static async createPasswordHash(unhashedPassword: string): Promise<string> {
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
