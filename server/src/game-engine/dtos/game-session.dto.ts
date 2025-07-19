import { UUID } from 'node:crypto';
import { Exclude, Expose } from 'class-transformer';

import { GameSessionStatus } from '@/constants/game';
import { BaseDTO, PartialBaseDTO } from '@/dtos/base.dto';
import { PlayerMove } from '@/types/main';

@Exclude()
export class GameSessionDTO extends BaseDTO {
  @Expose()
  playerOneID: UUID;

  @Expose()
  playerTwoID: UUID;

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
