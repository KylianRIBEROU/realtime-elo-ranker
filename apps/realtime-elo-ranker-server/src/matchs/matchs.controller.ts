import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { MatchDto } from './match.dto';
import { Response } from 'express';
import { PlayersService } from '../players/players.service';
import { MatchsService } from './matchs.service';

@Controller('match')
export class MatchsController {
      constructor(
          private readonly playersService: PlayersService,
          private readonly matchsService: MatchsService
      ) {}

  /**
   * Publie les résultats d'un match pour mettre à jour le classement des joueurs.
   * Si le match s'est terminé par un match nul, le champ draw doit être true
   * Dans le cas d'un match nul, les champs winner et loser ne font aucune différence.
   */
  @Post()
  async publishMatchResult(@Body() body: {winner: string, loser: string, draw: boolean}, @Res() res: Response) {
    if (!body.winner || !body.loser || body.winner === '' || body.loser === '' || body.draw === undefined) {
      return res.status(400).json({
        code: 400,
        message: 'Les champs winner, loser et draw sont obligatoires.'
      });
    }
    const matchResult = new MatchDto(body.winner, body.loser);
    if (matchResult.winner === matchResult.loser) {
      return res.status(400).json({
        code: 400,
        message: 'Les champs winner et loser ne peuvent pas être identiques.'
      });
    }
    const winner = this.playersService.findOne(matchResult.winner);
    const loser = this.playersService.findOne(matchResult.loser);
    if (!winner || !loser) {
      return res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
        code: 422,
        message: 'Soit le gagnant, soit le perdant indiqué n\'existe pas.'
      });
    }
    console.log ("APpel MatchService pour enregistrer le match");
    const { winnerDto, loserDto } = await this.matchsService.registerMatchResult(matchResult.winner, matchResult.loser, body.draw);

    return res.status(HttpStatus.OK).json({
      winner: winnerDto,
      loser: loserDto
    }); 

  }
}
