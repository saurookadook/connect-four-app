import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import {
  GameSession,
  GameSessionSchema,
} from '@game-engine/schemas/game-session.schema';
import { GameSessionService } from '@game-engine/session/game-session.service';

@Module({
  controllers: [],
  imports: [
    // MongooseModule.forFeature([
    //   { name: GameSession.name, schema: GameSessionSchema },
    // ]),
    MongooseModule.forFeatureAsync([
      {
        name: GameSession.name,
        useFactory: () => {
          const schema = GameSessionSchema;
          schema.pre('save', function () {
            console.log('[GameSessionSchema] - Pre-save hook triggered');
          });
          schema.post('save', function () {
            console.log('[GameSessionSchema] - Pre-save hook triggered');
          });
          // schema.on('error', (error) => {
          //   console.error('[GameSessionSchema] - Error:', error);
          // });
          return schema;
        },
      },
    ]),
  ],
  providers: [GameSessionService],
})
export class GameSessionModule {}
