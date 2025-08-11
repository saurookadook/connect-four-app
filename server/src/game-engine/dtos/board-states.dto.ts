import { Exclude, Expose } from 'class-transformer';
import { IsMongoId, IsString } from 'class-validator';

import {
  type GameBoard, // force formatting
  type PlayerMove,
} from '@connect-four-app/shared';
import { BaseDTO, PartialBaseDTO } from '@/dtos/base.dto';

@Exclude()
export class BoardStateDTO extends BaseDTO {
  @Expose()
  @IsString()
  @IsMongoId()
  gameSessionID: string;

  @Expose()
  cells: GameBoard;
}

@Exclude()
export class CreateBoardStateDTO {
  @Expose()
  @IsString()
  @IsMongoId()
  gameSessionID: BoardStateDTO['gameSessionID'];

  @Expose()
  moves?: PlayerMove[];
}

@Exclude()
export class UpdateBoardStateDTO extends PartialBaseDTO {
  @Expose()
  @IsString()
  @IsMongoId()
  gameSessionID: BoardStateDTO['gameSessionID'];

  @Expose()
  move?: PlayerMove;

  @Expose()
  cells?: BoardStateDTO['cells'];
}
