/* eslint-disable @typescript-eslint/no-empty-object-type */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Document, Model, RootFilterQuery, SortOrder, Types } from 'mongoose';

import { type PlayerID } from '@connect-four-app/shared';
import { CreatePlayerDTO, UpdatePlayerDTO } from './dtos/player.dto';
import {
  NullablePlayerDocument,
  Player,
  PlayerDocument,
} from './schemas/player.schema';

export type PlayerFilterOptions = RootFilterQuery<
  Document<unknown, {}, Player, {}> &
    Player & {
      _id: Types.ObjectId;
    } & {
      __v: number;
    }
>;

export type SortOptions =
  | string
  | { [key: string]: SortOrder | { $meta: any } }
  | [string, SortOrder][];

@Injectable()
export class PlayersService {
  constructor(
    @InjectModel(Player.name) private playerModel: Model<PlayerDocument>,
  ) {}

  async createOne(player: CreatePlayerDTO): Promise<PlayerDocument> {
    const createdPlayer = await new this.playerModel(player).save();
    // TODO: Exclude password from the returned document
    return createdPlayer;
  }

  /**
   * @param id Represents `ObjectId` in MongoDB
   */
  async findOneById(id: string): Promise<NullablePlayerDocument> {
    return await this.playerModel
      .findById(id, { projection: { password: 0 } })
      .exec();
  }

  async findOneByPlayerID(playerID: PlayerID) {
    return await this.playerModel
      .findOne({ playerID: playerID }, { projection: { password: 0 } })
      .exec();
  }

  async findOneByUsername(username: string) {
    return await this.playerModel
      .findOne({ username: username }, { projection: { password: 0 } })
      .exec();
  }

  async findAll(
    {
      filterOpts,
      sortOpts = { updatedAt: -1 },
    }: {
      filterOpts?: PlayerFilterOptions;
      sortOpts?: SortOptions;
    } = {
      sortOpts: { updatedAt: -1 },
    },
  ) {
    const filters = filterOpts == null ? {} : filterOpts;

    return this.playerModel
      .find(filters, {
        playerID: 1,
        username: 1,
        _id: 0,
      })
      .sort(sortOpts);
  }

  async updateOne(
    id: string,
    player: UpdatePlayerDTO,
  ): Promise<NullablePlayerDocument> {
    return this.playerModel.findByIdAndUpdate(id, player, { new: true }).exec();
  }

  async deleteOneById(id: string): Promise<NullablePlayerDocument> {
    return this.playerModel.findByIdAndDelete(id).exec();
  }
}
