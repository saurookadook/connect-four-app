import { Exclude, Expose } from 'class-transformer';

import {
  GameSessionStatus,
  type PlayerID,
  type PlayerMove,
} from '@connect-four-app/shared';
import { BaseDTO, PartialBaseDTO } from '@/dtos/base.dto';

@Exclude()
export class GameSessionDTO extends BaseDTO {
  @Expose()
  playerOneID: PlayerID;

  @Expose()
  playerTwoID: PlayerID;

  @Expose()
  moves: PlayerMove[];

  @Expose()
  status: GameSessionStatus;

  // constructor(partial: Partial<GameSessionDTO>) {
  //   Object.assign(this, partial);
  // }
}

@Exclude()
export class CreateGameSessionDTO {
  @Expose()
  playerOneID: GameSessionDTO['playerOneID'];

  @Expose()
  playerTwoID: GameSessionDTO['playerTwoID'];
}

@Exclude()
export class UpdateGameSessionDTO extends PartialBaseDTO {
  @Expose()
  playerOneID?: GameSessionDTO['playerOneID'];

  @Expose()
  playerTwoID?: GameSessionDTO['playerTwoID'];

  @Expose()
  moves?: PlayerMove[];

  @Expose()
  status?: GameSessionDTO['status'];
}
