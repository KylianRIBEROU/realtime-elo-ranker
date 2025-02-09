import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Player } from '../db/models/player.model';
import { UpdatedRankingEvent } from '../rankings/updated-ranking-event';
import { PlayerDto } from '../players/player.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class MatchsService {
  private readonly K_FACTOR = 32; // Coefficient de pondération
  private playedMatches: { winnerId: string, loserId: string, draw: boolean }[] = [];

  constructor(
    @InjectModel(Player) private playerModel: typeof Player,
    private eventEmitter: EventEmitter2
  ) {}

  async registerMatchResult(winnerId: string, loserId: string, draw: boolean) {
    const winner = await this.playerModel.findByPk(winnerId);
    const loser = await this.playerModel.findByPk(loserId);

    if (!winner || !loser) {
      throw new Error('Joueur introuvable');
    }

    const winnerRank = winner.rank;
    const loserRank = loser.rank;

    const expectedWinWinner = 1 / (1 + Math.pow(10, (loserRank - winnerRank) / 400));
    const expectedWinLoser = 1 - expectedWinWinner;

    let winnerNewRank = winnerRank;
    let loserNewRank = loserRank;

    if (draw) {
      // coeff 0.5 pour égalité
      winnerNewRank = Math.round(winnerRank + this.K_FACTOR * (0.5 - expectedWinWinner));
      loserNewRank = Math.round(loserRank + this.K_FACTOR * (0.5 - expectedWinLoser));
    } else {
      // coeff 1 pour victoire et 0 pour défaite
      winnerNewRank = Math.round(winnerRank + this.K_FACTOR * (1 - expectedWinWinner));
      loserNewRank = Math.round(loserRank + this.K_FACTOR * (0 - expectedWinLoser));
    }

    await winner.update({ rank: winnerNewRank });
    await loser.update({ rank: loserNewRank });

    const winnerDto: PlayerDto = PlayerDto.fromEntity(winner);
    const loserDto: PlayerDto = PlayerDto.fromEntity(loser);


    this.playedMatches.push({ winnerId, loserId, draw });
    
    console.log("Emit updated-ranking after match result");
    this.eventEmitter.emit('updated-ranking', 
      new UpdatedRankingEvent(winnerDto.id, winnerDto.rank));
    this.eventEmitter.emit('updated-ranking',
      new UpdatedRankingEvent(loserDto.id, loserDto.rank));
      
    return { winnerDto, loserDto };
  }
}
