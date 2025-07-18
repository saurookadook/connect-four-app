import { Exclude, Expose } from 'class-transformer';
import { isEmail, IsNotEmpty, IsString } from 'class-validator';

@Exclude()
export class AuthenticationRequestDTO {
  @IsNotEmpty()
  @IsString()
  @Expose()
  username: string;

  @IsNotEmpty()
  @IsString()
  @Expose()
  password: string;

  @IsNotEmpty()
  @IsString()
  // @isEmail()
  @Expose()
  email?: string;
}

@Exclude()
export class RegisterDTO {
  // TODO: enforce limits on min/max characters and character types
  @IsNotEmpty()
  @IsString()
  @Expose()
  username: string;

  @IsNotEmpty()
  @IsString()
  @Expose({ name: 'password' })
  unhashedPassword: string;

  @IsNotEmpty()
  @IsString()
  // @isEmail()
  @Expose()
  email?: string;
}

@Exclude()
export class LoginDTO {
  // TODO: enforce limits on min/max characters and character types
  @IsNotEmpty()
  @IsString()
  @Expose()
  username: string;

  @IsNotEmpty()
  @IsString()
  @Expose({ name: 'password' })
  unhashedPassword: string;
}
