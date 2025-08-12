import { Exclude, Expose } from 'class-transformer';
import {
  IsDateString,
  IsEnum,
  IsMongoId,
  IsOptional,
  IsString,
  IsStrongPassword,
  IsUUID,
  ValidateIf,
  type IsStrongPasswordOptions,
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
  @IsMongoId()
  playerOneObjectID?: Types.ObjectId;

  @Expose()
  @IsUUID()
  playerOneID: GameSessionDTO['playerOneID'];

  @Expose()
  @IsOptional()
  @IsMongoId()
  playerTwoObjectID?: Types.ObjectId;

  @Expose()
  @IsUUID()
  playerTwoID: GameSessionDTO['playerTwoID'];

  @Expose()
  @IsOptional()
  moves?: GameSessionDTO['moves'];

  @Expose()
  @IsOptional()
  @IsEnum(GameSessionStatus)
  status?: GameSessionDTO['status'];
}

@Exclude()
export class UpdateGameSessionDTO extends PartialBaseDTO {
  @Expose()
  @IsOptional()
  @IsMongoId()
  playerOneObjectID?: CreateGameSessionDTO['playerOneObjectID'];

  @Expose()
  @IsOptional()
  @IsUUID()
  playerOneID?: GameSessionDTO['playerOneID'];

  @Expose()
  @IsOptional()
  @IsMongoId()
  playerTwoObjectID?: CreateGameSessionDTO['playerTwoObjectID'];

  @Expose()
  @IsOptional()
  @IsUUID()
  playerTwoID?: GameSessionDTO['playerTwoID'];

  @Expose()
  @IsOptional()
  moves?: PlayerMove[];

  @Expose()
  @IsOptional()
  @IsEnum(GameSessionStatus)
  status?: GameSessionDTO['status'];
}
