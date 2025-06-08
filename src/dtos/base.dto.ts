import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class BaseDTO {
  @Expose({ name: '_id' })
  id: string;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}
