import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { MONGO_CONNECTION_URL } from '@constants/db';
import { GameEngineModule } from '@game-engine/game-engine.module';
import { AppController } from '@/app.controller';
import { AppService } from '@/app.service';

@Module({
  controllers: [AppController],
  imports: [
    MongooseModule.forRoot(MONGO_CONNECTION_URL), // force formatting
    GameEngineModule,
  ],
  providers: [AppService],
})
export class AppModule {}
