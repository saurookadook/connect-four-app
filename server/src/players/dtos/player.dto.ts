import { Exclude, Expose } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsStrongPassword,
  IsUUID,
  Matches,
} from 'class-validator';

import {
  usernamePattern,
  passwordPattern,
  type PlayerID,
} from '@connect-four-app/shared';
import { BaseDTO, PartialBaseDTO } from '@/dtos/base.dto';

@Exclude()
export class PlayerDTO extends BaseDTO {
  @Expose()
  @IsUUID()
  playerID: PlayerID;

  @Expose()
  @IsString()
  username: string;

  @Expose()
  @IsString()
  password: string;

  @Expose()
  @IsOptional()
  @IsEmail()
  email?: string;
}

@Exclude()
export class CreatePlayerDTO {
  @Expose()
  @IsUUID()
  playerID: PlayerDTO['playerID'];

  @Expose()
  @IsString()
  @Matches(usernamePattern.asRegExp)
  username: PlayerDTO['username'];

  @Expose()
  @IsString()
  @Matches(passwordPattern.asRegExp)
  // @IsStrongPassword()
  password: PlayerDTO['password'];

  @Expose()
  @IsOptional()
  @IsEmail()
  email?: PlayerDTO['email'];
}

@Exclude()
export class UpdatePlayerDTO extends PartialBaseDTO {
  @Expose()
  @IsOptional()
  @IsUUID()
  playerID?: PlayerDTO['playerID'];

  @Expose()
  @IsOptional()
  @Matches(usernamePattern.asRegExp)
  username?: PlayerDTO['username'];

  @Expose()
  @IsOptional()
  @Matches(passwordPattern.asRegExp)
  // @IsStrongPassword()
  // TODO: this should somehow compare the existing value to the new value
  password?: PlayerDTO['password'];

  @Expose()
  @IsOptional()
  @IsEmail()
  email?: PlayerDTO['email'];
}
