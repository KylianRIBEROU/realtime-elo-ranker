import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Player } from '../db/models/player.model';
import { PlayersService } from './players.service';
import { PlayersController } from './players.controller';

@Module({
    imports: [SequelizeModule.forFeature([Player])],
    controllers: [PlayersController],
    providers: [PlayersService],
    exports : [PlayersService, SequelizeModule]
})
export class PlayersModule {}
