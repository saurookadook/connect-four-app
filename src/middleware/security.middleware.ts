import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class SecurityMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    res.setHeader('Access-Control-Allow-Origin', '*'); // TODO: might not need this?
    res.setHeader('Cross-Origin-Resource-Policy', 'same-site');
    next();
  }
}
