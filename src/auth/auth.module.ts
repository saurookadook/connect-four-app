import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';

import { PlayerModule } from '@/player/player.module';
import { LocalStrategy } from './strategies/local.strategy';
import { AuthController } from './auth.controller';
import { AuthenticationService } from './authentication.service';

@Module({
  controllers: [AuthController],
  imports: [
    PassportModule.register({ session: true }), // force formatting
    PlayerModule,
  ],
  providers: [
    AuthenticationService, // force formatting
    LocalStrategy,
  ],
  exports: [
    AuthenticationService, // force formatting
    LocalStrategy,
  ],
})
export class AuthModule {}
