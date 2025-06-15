import { Injectable } from '@nestjs/common';

import { CreatePlayerDTO } from '@/player/dtos/player.dto';
import { PlayerDocument } from '@/player/schemas/player.schema';
import { PlayerService } from '@/player/player.service';
import { LoginDTO } from './dtos/auth.dto';

@Injectable()
export class AuthService {
  constructor(private playerService: PlayerService) {}

  async register(playerData: CreatePlayerDTO): Promise<PlayerDocument> {
    return this.playerService.createOne(playerData);
  }

  async login(credentials: LoginDTO): Promise<PlayerDocument | null> {
    const player = await this.playerService.findOneByUsername(
      credentials.username,
    );
    if (player && player.password === credentials.password) {
      return player;
    }

    return null;
  }

  async logout(playerID: string): Promise<string> {
    // Invalidate the player's session (implementation depends on your auth strategy)
    return 'Player logged out successfully';
  }
}
