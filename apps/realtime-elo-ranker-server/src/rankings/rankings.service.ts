import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Player } from '../db/models/player.model';
import { PlayerDto } from '../players/player.dto';

@Injectable()
export class RankingsService {
    private ranking: PlayerDto[];

    constructor(@InjectModel(Player) private playerModel: typeof Player) {
        this.ranking = [];
        this.updateCachedRanking();
    }

    async getRankingsSortedByRank(): Promise<PlayerDto[]> {
        const count = await this.playerModel.findAll().then((players) => players.length);
        if (this.ranking.length === count) {
            return this.ranking;
        }
        let players = await this.playerModel.findAll({
            order: [['rank', 'DESC']],
        });
        if (players.length === 0){
            return [];
        }
        this.updateRankingFromPlayerList(players);
        players = players.sort((a, b) => b.rank - a.rank);
        return players.map((player) => PlayerDto.fromEntity(player));
    }

    private async updateCachedRanking() {
    // Charger tous les joueurs et leur rang depuis la base de données
    console.log("Initialisation cache rankings");
    const players = await this.playerModel.findAll();
    this.ranking = players
      .map(player => PlayerDto.fromEntity(player))
      .sort((a, b) => b.rank - a.rank); 
  }

    private updateRankingFromPlayerList(players: Player[]){
        this.ranking = players
        .map(player => PlayerDto.fromEntity(player))
        .sort((a, b) => b.rank - a.rank);
    }

  getRanking(): PlayerDto[] {
    return this.ranking;
  }
}
