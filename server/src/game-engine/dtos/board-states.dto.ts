import { Exclude, Expose } from 'class-transformer';

import {
  type BoardCell, // force formatting
  type PlayerMove,
} from '@connect-four-app/shared';
import { BaseDTO, PartialBaseDTO } from '@/dtos/base.dto';

@Exclude()
export class BoardStateDTO extends BaseDTO {
  @Expose()
  gameSessionID: string;

  @Expose()
  state: BoardCell[][];
}

@Exclude()
export class CreateBoardStateDTO {
  @Expose()
  gameSessionID: BoardStateDTO['gameSessionID'];

  @Expose()
  moves?: PlayerMove[];
}

@Exclude()
export class UpdateBoardStateDTO extends PartialBaseDTO {
  @Expose()
  gameSessionID: BoardStateDTO['gameSessionID'];

  @Expose()
  move?: PlayerMove;

  @Expose()
  state?: BoardStateDTO['state'];
}
