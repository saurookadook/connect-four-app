import { inspect } from 'node:util';
import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';

import { sharedLog } from '@connect-four-app/shared';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

const logger = sharedLog.getLogger('LocalAuthGuard');

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    return super.canActivate(context);
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
