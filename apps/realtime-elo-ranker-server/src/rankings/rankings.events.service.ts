import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { Subject } from 'rxjs';
import { UpdatedRankingEvent } from './updated-ranking-event';

@Injectable()
export class RankingEventsService {
  private rankingUpdates = new Subject<UpdatedRankingEvent>();


  @OnEvent('updated-ranking')
  handleUpdatedRanking(payload: UpdatedRankingEvent) {
    console.log('Mise à jour classement : ', payload);
    this.rankingUpdates.next(payload);
  }

  getRankingUpdates() {
    return this.rankingUpdates.asObservable();
  }
}
