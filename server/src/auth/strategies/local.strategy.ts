import { inspect } from 'node:util';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';

import { sharedLog } from '@connect-four-app/shared';
import { AuthenticationService } from '@/auth/authentication.service';

const logger = sharedLog.getLogger('LocalStrategy');
logger.setLevel('ERROR');

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authenticationService: AuthenticationService) {
    super({
      usernameField: 'username',
      passwordField: 'password',
    });
  }

  async validate(username: string, password: string): Promise<any> {
    logger.debug(
      `[${this.validate.name} method] username: '${username}'  |  password: '${password}'`,
    );

    const user = await this.authenticationService.validatePlayer({
      username,
      unhashedPassword: password,
    });
    logger.debug(
      `[${this.validate.name} method] user:`,
      inspect({ user }, { colors: true, compact: false, depth: 2 }),
    );

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return user;
  }
}
