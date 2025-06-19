import { UUID } from 'node:crypto';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CreatePlayerDTO, UpdatePlayerDTO } from './dtos/player.dto';
import {
  NullablePlayerDocument,
  Player,
  PlayerDocument,
} from './schemas/player.schema';

@Injectable()
export class PlayerService {
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

  async findOneByPlayerID(playerID: UUID) {
    return await this.playerModel
      .findOne({ playerID: playerID }, { projection: { password: 0 } })
      .exec();
  }

  async findOneByUsername(username: string) {
    return await this.playerModel
      .findOne({ username: username }, { projection: { password: 0 } })
      .exec();
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
