import { inspect } from 'node:util';
import {
  CanActivate, // force formatting
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { Observable } from 'rxjs';

import { sharedLog } from '@connect-four-app/shared';
import { IS_PUBLIC_KEY } from '@/auth/decorators';

const logger = sharedLog.getLogger('LoggedInGuard');
logger.setLevel('ERROR');

@Injectable()
export class LoggedInGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const httpContext = context.switchToHttp();
    const request = httpContext.getRequest<Request>();

    logger.debug(
      `${'-'.repeat(60)} [ ${this.canActivate.name} method ] ${'-'.repeat(60)}\n`,
      inspect(
        {
          context,
          httpContext,
          // request,
          reqHeaders: request.headers,
          reqUser: request.user,
          sessionID: request.sessionID,
          isAuthenticated: request.isAuthenticated(),
        },
        { colors: true, compact: false, depth: 1 },
      ),
    );

    return request.isAuthenticated();
  }
}
