import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RankingModule } from './rankings/rankings.module';
import { PlayersModule } from './players/players.module';
import { MatchModule } from './matchs/matchs.module';
import { DatabaseModule } from './db/database.module';

@Module({
  imports: [EventEmitterModule.forRoot(), RankingModule, PlayersModule, MatchModule, DatabaseModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
