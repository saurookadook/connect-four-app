import { Exclude, Expose } from 'class-transformer';
import {
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
  ValidateIf,
} from 'class-validator';
import { Types } from 'mongoose';

import {
  GameSessionStatus,
  type Nullable,
  type PlayerID,
  type PlayerMove,
} from '@connect-four-app/shared';
import { BaseDTO, PartialBaseDTO } from '@/dtos/base.dto';

@Exclude()
export class GameSessionDTO extends BaseDTO {
  @Expose()
  @IsUUID()
  playerOneID: PlayerID;

  @Expose()
  @IsString()
  playerOneUsername: string;

  @Expose()
  @IsUUID()
  playerTwoID: PlayerID;

  @Expose()
  @IsString()
  playerTwoUsername: string;

  @Expose()
  moves: PlayerMove[];

  @Expose()
  @IsEnum(GameSessionStatus)
  status: GameSessionStatus;

  @Expose()
  @ValidateIf((o) => o.winner != null)
  @IsUUID()
  winner: Nullable<PlayerID>;

  // constructor(partial: Partial<GameSessionDTO>) {
  //   Object.assign(this, partial);
  // }
}

@Exclude()
export class CreateGameSessionDTO {
  @Expose()
  @IsOptional()
  playerOneObjectID?: Types.ObjectId;

  @Expose()
  @IsUUID()
  playerOneID: GameSessionDTO['playerOneID'];

  @Expose()
  @IsOptional()
  playerTwoObjectID?: Types.ObjectId;

  @Expose()
  @IsUUID()
  playerTwoID: GameSessionDTO['playerTwoID'];

  @Expose()
  @IsOptional()
  moves?: GameSessionDTO['moves'];

  @Expose()
  @IsOptional()
  status?: GameSessionDTO['status'];
}

@Exclude()
export class UpdateGameSessionDTO extends PartialBaseDTO {
  @Expose()
  @IsOptional()
  playerOneObjectID?: CreateGameSessionDTO['playerOneObjectID'];

  @Expose()
  @IsOptional()
  playerOneID?: GameSessionDTO['playerOneID'];

  @Expose()
  @IsOptional()
  playerTwoObjectID?: CreateGameSessionDTO['playerTwoObjectID'];

  @Expose()
  @IsOptional()
  playerTwoID?: GameSessionDTO['playerTwoID'];

  @Expose()
  @IsOptional()
  moves?: PlayerMove[];

  @Expose()
  @IsOptional()
  status?: GameSessionDTO['status'];
}
