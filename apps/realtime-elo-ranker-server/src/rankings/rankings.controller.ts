import { Controller, Get, HttpStatus, Req, Res, Sse } from '@nestjs/common';
import { RankingsService } from './rankings.service';
import { PlayerDto } from 'src/players/player.dto';
import { MessageEvent } from './/message-event.interface';
import { RankingEventsService } from './rankings.events.service';
import { Request, Response } from 'express';
import { interval, map, Observable } from 'rxjs';

@Controller('ranking')
export class RankingsController {
    
    constructor(
        private readonly rankingService: RankingsService,
        private readonly rankingEventsService: RankingEventsService
    ) {}
 

    @Get()
    async getRanking(@Res() res: Response) {
        const players:PlayerDto[] = await this.rankingService.getRankingsSortedByRank();

        if (players.length === 0){
            return res.status(HttpStatus.NOT_FOUND).json({
                code: HttpStatus.NOT_FOUND,
                message: "Le classement n'est pas disponible car aucun joueur existe."

            });
        }
        console.log("recup des joueurs", players);
        return res.status(HttpStatus.OK).json(players)
    }

    @Get('events')
    @Sse()
    subscribeToRankingUpdates(): Observable<MessageEvent> {
        console.log("a client Subscribed to ranking updates");
        return this.rankingEventsService.getRankingUpdates().pipe(
        map((data) => ({
            data: JSON.stringify({
                type: "RankingUpdate",
                player: {
                    id: data.id,
                    rank: data.rank
                }
            })
        }))
        );
    }
}
