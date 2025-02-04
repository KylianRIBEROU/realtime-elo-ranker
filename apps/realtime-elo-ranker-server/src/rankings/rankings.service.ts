import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Player } from '../db/models/player.model';
import { PlayerDto } from 'src/players/player.dto';

@Injectable()
export class RankingsService {
    constructor(@InjectModel(Player) private playerModel: typeof Player) {}

    async getRankingsSortedByRank(): Promise<PlayerDto[]> {
        const players = await this.playerModel.findAll({
            order: [['rank', 'DESC']],
        });
        if (players.length === 0){
            return [];
        }
        return players.map((player) => PlayerDto.fromEntity(player));
    }
}
