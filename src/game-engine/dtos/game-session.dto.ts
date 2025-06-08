import { UUID } from 'node:crypto';
import { Exclude, Expose } from 'class-transformer';

import { PlayerMove } from '@/constants/game';
import { BaseDTO } from '@/dtos/base.dto';

@Exclude()
export class GameSessionDTO extends BaseDTO {
  @Expose()
  playerOneID: UUID;

  @Expose()
  playerTwoID: UUID;

  @Expose()
  moves: PlayerMove[];

  @Expose()
  status: string;

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
export class UpdateGameSessionDTO {
  @Expose()
  playerOneID?: GameSessionDTO['playerOneID'];

  @Expose()
  playerTwoID?: GameSessionDTO['playerTwoID'];

  @Expose()
  moves?: PlayerMove[];

  @Expose()
  status?: GameSessionDTO['status'];
}
