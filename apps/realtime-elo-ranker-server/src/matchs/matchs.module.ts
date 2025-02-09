import { Module } from '@nestjs/common';
import { MatchsService } from './matchs.service';
import { MatchsController } from './matchs.controller';
import { PlayersModule } from '../players/players.module';

@Module({
    imports: [PlayersModule],
    controllers: [MatchsController],
    providers: [MatchsService],
    exports: [MatchsService]
})
export class MatchModule {}
