import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AuthModule } from '@/auth/auth.module';
import { PlayersModule } from '@/players/players.module';
import { GameSession, GameSessionSchema } from '../schemas/game-session.schema';
import { GameSessionsController } from './game-sessions.controller';
import { GameSessionsService } from './game-sessions.service';

@Module({
  controllers: [GameSessionsController],
  imports: [
    MongooseModule.forFeature([
      { name: GameSession.name, schema: GameSessionSchema }, // force formatting
    ]),
    AuthModule,
    PlayersModule,
  ],
  providers: [GameSessionsService],
  exports: [GameSessionsService],
})
export class GameSessionsModule {}
