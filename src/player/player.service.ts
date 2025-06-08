import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CreatePlayerDTO, UpdatePlayerDTO } from '@/player/dtos/player.dto';
import {
  NullablePlayerDocument,
  Player,
  PlayerDocument,
} from '@/player/schemas/player.schema';

@Injectable()
export class PlayerService {
  constructor(
    @InjectModel(Player.name) private playerModel: Model<PlayerDocument>,
  ) {}

  async createOne(player: CreatePlayerDTO) {
    // placeholder to make tests fail
  }

  async findOneById(id: string) {
    // placeholder to make tests fail
  }

  async updateOne(id: string, player: UpdatePlayerDTO) {
    // placeholder to make tests fail
  }

  async deleteOnebyId(id: string) {
    // placeholder to make tests fail
  }

  // async createOne(player: CreatePlayerDTO): Promise<PlayerDocument> {
  //   const createdPlayer = new this.playerModel(player);
  //   return createdPlayer.save();
  // }

  // async findOneById(id: string): Promise<NullablePlayerDocument> {
  //   return await this.playerModel.findById(id).exec();
  // }

  // async updateOne(
  //   id: string,
  //   player: UpdatePlayerDTO,
  // ): Promise<NullablePlayerDocument> {
  //   return this.playerModel.findByIdAndUpdate(id, player, { new: true }).exec();
  // }

  // async deleteOnebyId(id: string): Promise<NullablePlayerDocument> {
  //   return this.playerModel.findByIdAndDelete(id).exec();
  // }
}
