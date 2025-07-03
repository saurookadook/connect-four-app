import { APP_FILTER } from '@nestjs/core';

import { CatchAllFilter } from './catch-all.filter';
import { HttpExceptionFilter } from './http-exception.filter';

export const CatchAllFilterProvider = {
  provide: APP_FILTER,
  useClass: CatchAllFilter,
};

export const HttpExceptionFilterProvider = {
  provide: APP_FILTER,
  useClass: HttpExceptionFilter,
};
