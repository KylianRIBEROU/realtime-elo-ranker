import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { Response } from 'express'; 
import { PlayersService } from './players.service';

@Controller('player')
export class PlayersController {
    constructor(
        private readonly playersService: PlayersService,
    ) {}

    @Post() 
    async createPlayer(@Body() body: { id: string },  @Res() res: Response) {
        const { id } = body;
        if (!id || id === '') {
            return res.status(HttpStatus.BAD_REQUEST)
            .json({
                code: HttpStatus.BAD_REQUEST, 
                message: 'L\'identifiant du joueur n\'est pas valide.' 
            });
        }
        const playerExists = await this.playersService.findOne(id);
        if (playerExists) {
            return res.status(HttpStatus.CONFLICT)
            .json({
                code: HttpStatus.CONFLICT, 
                message: 'Le joueur existe déjà.' 
            });
        }
        const playerResponse = await this.playersService.create(id);
        return res.status(HttpStatus.OK).json({
            playerResponse
          });
    }
}