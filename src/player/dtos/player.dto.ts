import { UUID } from 'node:crypto';
import { Exclude, Expose } from 'class-transformer';

import { BaseDTO, PartialBaseDTO } from '@/dtos/base.dto';

@Exclude()
export class PlayerDTO extends BaseDTO {
  @Expose()
  playerID: UUID;

  @Expose()
  username: string;

  @Expose()
  password: string;

  @Expose()
  email?: string;
}

@Exclude()
export class CreatePlayerDTO {
  @Expose()
  playerID: PlayerDTO['playerID'];

  @Expose()
  username: PlayerDTO['username'];

  @Expose()
  password: string;

  @Expose()
  email?: PlayerDTO['email'];
}

@Exclude()
export class UpdatePlayerDTO extends PartialBaseDTO {
  @Expose()
  playerID?: PlayerDTO['playerID'];

  @Expose()
  username?: PlayerDTO['username'];

  @Expose()
  password?: PlayerDTO['password'];

  @Expose()
  email?: PlayerDTO['email'];
}
