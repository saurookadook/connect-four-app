/* eslint-disable @typescript-eslint/no-unsafe-function-type */
import { inspect } from 'node:util';
import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

import { sharedLog } from '@connect-four-app/shared';

const logger = sharedLog.getLogger('DTOValidationPipe');

@Injectable()
export class DTOValidationPipe implements PipeTransform<any> {
  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (!metatype || !this.isNativeJSType(metatype)) {
      return value;
    }

    const dtoObject = plainToInstance(metatype, value);
    const errors = await validate(dtoObject);

    if (errors.length > 0) {
      throw new BadRequestException('DTO Validation failed', { cause: errors });
    }

    return dtoObject;
  }

  private isNativeJSType(metatype: Function): boolean {
    const nativeJSTypes: Function[] = [String, Boolean, Number, Array, Object];
    return !nativeJSTypes.includes(metatype);
  }
}
