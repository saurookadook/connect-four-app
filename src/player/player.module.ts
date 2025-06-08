import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Player, PlayerSchema } from '@/player/schemas/player.schema';
import { PlayerService } from '@/player/player.service';

@Module({
  controllers: [],
  imports: [
    MongooseModule.forFeature([{ name: Player.name, schema: PlayerSchema }]),
  ],
  providers: [PlayerService],
})
export class PlayerModule {}
