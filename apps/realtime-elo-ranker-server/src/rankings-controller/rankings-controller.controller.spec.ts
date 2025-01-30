import { Test, TestingModule } from '@nestjs/testing';
import { RankingsControllerController } from './rankings-controller.controller';

describe('RankingsControllerController', () => {
  let controller: RankingsControllerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RankingsControllerController],
    }).compile();

    controller = module.get<RankingsControllerController>(
      RankingsControllerController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
