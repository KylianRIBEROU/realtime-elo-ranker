import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Player } from '../db/models/player.model';
import { PlayerDto } from './player.dto';
import { UpdatedRankingEvent } from 'src/rankings/updated-ranking-event';
import { EventEmitter2 } from '@nestjs/event-emitter';

  @Injectable()
  export class PlayersService {
    constructor(@InjectModel(Player) private playerModel: typeof Player,
      private eventEmitter: EventEmitter2
  ) {}

    async create(id: string): Promise<PlayerDto | null> {
      const rank = await this.calculateDefaultRanking();
      try {
        const player = await this.playerModel.create({ id, rank });
        console.log("Emit updated-ranking after player creation");
        this.eventEmitter.emit('updated-ranking', new UpdatedRankingEvent(player.id, player.rank));
        return PlayerDto.fromEntity(player);
      } catch (err) {
        console.error(err);
        return null;
      }
    }
    

    async findAll(): Promise<PlayerDto[]> {
      const players = await this.playerModel.findAll();
      return players.map((player) => PlayerDto.fromEntity(player));
    }
    

    async findOne(id: string): Promise<PlayerDto | null> {
      return this.playerModel.findByPk(id).then((player) => {
        if (!player) {
          return null;
        }
        return PlayerDto.fromEntity(player);
      });
    }

    async calculateDefaultRanking(): Promise<number> {
      const players = await this.playerModel.findAll();
      if (players.length === 0) {
        return 1000;
      }
      const totalRank = players.reduce((sum, player) => sum + player.rank, 0);
      return totalRank / players.length;
  }
}