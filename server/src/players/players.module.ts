import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Player, PlayerSchema } from './schemas/player.schema';
import { PlayersService } from './players.service';

@Module({
  controllers: [],
  imports: [
    MongooseModule.forFeature([{ name: Player.name, schema: PlayerSchema }]),
  ],
  providers: [PlayersService],
  exports: [PlayersService],
})
export class PlayersModule {}
