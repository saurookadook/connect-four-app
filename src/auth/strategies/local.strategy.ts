import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';

import { AuthenticationService } from '../authentication.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authenticationService: AuthenticationService) {
    super({
      usernameField: 'username',
      passwordField: 'password',
    });
  }

  async validate(username: string, password: string): Promise<any> {
    const user = await this.authenticationService.validatePlayer({
      username,
      unhashedPassword: password,
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return user;
  }
}
