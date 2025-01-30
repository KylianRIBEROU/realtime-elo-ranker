import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RankingsControllerController } from './rankings-controller/rankings-controller.controller';

@Module({
  imports: [],
  controllers: [AppController, RankingsControllerController],
  providers: [AppService],
})
export class AppModule {}
