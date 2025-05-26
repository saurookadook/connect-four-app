import { UUID } from 'node:crypto';
import { Exclude, Expose } from 'class-transformer';

import { PlayerMove } from '@constants/game';

@Exclude()
export class GameSessionDTO {
  @Expose({ name: '_id' })
  id: string;

  @Expose()
  playerOneID: UUID;

  @Expose()
  playerTwoID: UUID;

  @Expose()
  moves: PlayerMove[];

  @Expose()
  status: string;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

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
