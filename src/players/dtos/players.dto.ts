import { UUID } from 'node:crypto';
import { Exclude, Expose } from 'class-transformer';

import { BaseDTO } from '@/dtos/base.dto';

@Exclude()
export class PlayerDTO extends BaseDTO {
  @Expose()
  playerID: UUID;

  @Expose()
  username?: string;

  @Expose()
  email?: string;
}
