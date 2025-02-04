import { Module } from '@nestjs/common';
import { RankingsController } from './rankings.controller';
import { RankingsService } from './rankings.service';
import { MatchModule } from 'src/matchs/matchs.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { Player } from 'src/db/models/player.model';
import { RankingEventsService } from './rankings.events.service';

@Module({
    imports : [MatchModule, SequelizeModule.forFeature([Player])],
    controllers: [RankingsController],
    providers: [RankingsService, RankingEventsService],
    exports: [RankingsService]
})
export class RankingModule {}