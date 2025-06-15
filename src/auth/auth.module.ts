import { Module } from '@nestjs/common';

import { PlayerModule } from '@/player/player.module';
import { AuthenticationService } from './authentication.service';

@Module({
  controllers: [],
  imports: [PlayerModule],
  providers: [AuthenticationService],
  exports: [AuthenticationService],
})
export class AuthModule {}
