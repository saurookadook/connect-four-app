import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class RegisterDTO {
  @Expose()
  username: string;

  @Expose()
  unhashedPassword: string;

  @Expose()
  email?: string;
}

@Exclude()
export class LoginDTO {
  @Expose()
  username: string;

  @Expose()
  password: string;
}
