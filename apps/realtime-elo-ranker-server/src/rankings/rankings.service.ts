import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Player } from '../db/models/player.model';
import { PlayerDto } from '../players/player.dto';

@Injectable()
export class RankingsService {
    constructor(@InjectModel(Player) private playerModel: typeof Player) {}

    async getRankingsSortedByRank(): Promise<PlayerDto[]> {
        let players = await this.playerModel.findAll({
            order: [['rank', 'DESC']],
        });
        if (players.length === 0){
            return [];
        }
        players = players.sort((a, b) => b.rank - a.rank);
        return players.map((player) => PlayerDto.fromEntity(player));
    }
}
