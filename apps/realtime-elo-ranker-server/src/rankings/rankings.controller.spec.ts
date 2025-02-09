import { Test, TestingModule } from '@nestjs/testing';
import { RankingsController } from './rankings.controller';
import { RankingsService } from './rankings.service';
import { RankingEventsService } from './rankings.events.service';

describe('RankingsController', () => {
  let controller: RankingsController;
  let rankingsServiceMock: any;
  let rankingEventsServiceMock: any;

  beforeEach(async () => {
    rankingsServiceMock = {
      getRankingsSortedByRank: jest.fn().mockResolvedValue([{ id: 'Kyks', rank: 1000 }]),
    };

    rankingEventsServiceMock = {
      getRankingUpdates: jest.fn().mockReturnValue({
        pipe: jest.fn().mockReturnThis(),
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [RankingsController],
      providers: [
        { provide: RankingsService, useValue: rankingsServiceMock },
        { provide: RankingEventsService, useValue: rankingEventsServiceMock },
      ],
    }).compile();

    controller = module.get<RankingsController>(RankingsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return a ranking list', async () => {
    const response = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await controller.getRanking(response as any);

    expect(rankingsServiceMock.getRankingsSortedByRank).toHaveBeenCalled();
    expect(response.status).toHaveBeenCalledWith(200);
    expect(response.json).toHaveBeenCalledWith([{ id: 'Kyks', rank: 1000 }]);
  });
});
