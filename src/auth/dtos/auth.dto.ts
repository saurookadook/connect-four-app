import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class LoginDTO {
  @Expose()
  username: string;

  @Expose()
  password: string;
}
