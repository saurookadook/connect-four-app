import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';

import { PlayersModule } from '@/players/players.module';
import { LocalStrategy } from './strategies/local.strategy';
import { AuthController } from './auth.controller';
import { AuthenticationSerializer } from './authentication.serializer';
import { AuthenticationService } from './authentication.service';

@Module({
  controllers: [AuthController],
  imports: [
    PassportModule.register({ session: true }), // force formatting
    PlayersModule,
  ],
  providers: [
    AuthenticationSerializer,
    AuthenticationService, // force formatting
    LocalStrategy,
  ],
  exports: [
    AuthenticationSerializer,
    AuthenticationService, // force formatting
    LocalStrategy,
  ],
})
export class AuthModule {}
