import { inspect } from 'node:util';
import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';

import { sharedLog } from '@connect-four-app/shared';
import { IS_PUBLIC_KEY } from '@/auth/decorators';

const logger = sharedLog.getLogger('LocalAuthGuard');
logger.setLevel('ERROR');

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
  constructor(private reflector: Reflector) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    logger.debug(
      `[${this.canActivate.name} method] - is public? ${isPublic}\n`,
    );

    if (isPublic) {
      return true;
    }

    const result = (await super.canActivate(context)) as boolean;
    logger.debug(`[${this.canActivate.name} method] - result\n`, {
      result,
    });
    const logInResult = await super.logIn(context.switchToHttp().getRequest());
    logger.debug(`[${this.canActivate.name} method] - logInResult\n`, {
      logInResult,
    });

    return result;
  }

  handleRequest(err, user, info) {
    logger.trace(
      '[handleRequest method] call args:\n',
      inspect(
        {
          err,
          user,
          info,
        },
        { colors: true, compact: false, depth: 3, sorted: true },
      ),
    );

    // You can throw an exception based on either "info" or "err" arguments
    if (err || !user) {
      throw err || new UnauthorizedException();
    }
    return user;
  }
}
