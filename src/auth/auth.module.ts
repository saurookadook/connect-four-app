import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';

import { PlayerModule } from '@/player/player.module';
import { LocalStrategy } from './strategies/local.strategy';
import { AuthController } from './auth.controller';
import { AuthenticationService } from './authentication.service';

@Module({
  controllers: [AuthController],
  imports: [PassportModule, PlayerModule],
  providers: [AuthenticationService, LocalStrategy],
  exports: [AuthenticationService, LocalStrategy],
})
export class AuthModule {}
