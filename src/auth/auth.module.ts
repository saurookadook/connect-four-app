import { Module } from '@nestjs/common';

import { PlayerModule } from '@/player/player.module';
import { AuthController } from './auth.controller';
import { AuthenticationService } from './authentication.service';

@Module({
  controllers: [AuthController],
  imports: [PlayerModule],
  providers: [AuthenticationService],
  exports: [AuthenticationService],
})
export class AuthModule {}
