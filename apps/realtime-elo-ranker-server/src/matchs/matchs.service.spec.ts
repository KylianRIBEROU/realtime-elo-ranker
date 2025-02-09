import { Test, TestingModule } from '@nestjs/testing';
import { MatchsService } from './matchs.service';
import { getModelToken } from '@nestjs/sequelize';
import { Player } from '../db/models/player.model';
import { EventEmitter2 } from '@nestjs/event-emitter';

describe('MatchsService', () => {
  let service: MatchsService;
  let playerModelMock: any;
  let eventEmitterMock: any;

  beforeEach(async () => {
    playerModelMock = {
      findByPk: jest.fn(),
    };

    eventEmitterMock = {
      emit: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MatchsService,
        { provide: getModelToken(Player), useValue: playerModelMock },
        { provide: EventEmitter2, useValue: eventEmitterMock },
      ],
    }).compile();

    service = module.get<MatchsService>(MatchsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should throw an error if a player is not found', async () => {
    playerModelMock.findByPk.mockResolvedValue(null);

    await expect(service.registerMatchResult('winnerId', 'loserId', false))
      .rejects.toThrow('Joueur introuvable');
  });

  it('should update player ranks correctly after a match', async () => {
    const winner = { id: 'winnerId', rank: 1200, update: jest.fn() };
    const loser = { id: 'loserId', rank: 1100, update: jest.fn() };

    playerModelMock.findByPk.mockImplementation((id:string) => {
      if (id === 'winnerId') return winner;
      if (id === 'loserId') return loser;
      return null;
    });

    await service.registerMatchResult('winnerId', 'loserId', false);

    expect(winner.update).toHaveBeenCalledWith({ rank: expect.any(Number) });
    expect(loser.update).toHaveBeenCalledWith({ rank: expect.any(Number) });
  });

  it('should emit an event after updating the ranking', async () => {
    const winner = { id: 'winnerId', rank: 1200, update: jest.fn() };
    const loser = { id: 'loserId', rank: 1100, update: jest.fn() };
  
    playerModelMock.findByPk.mockImplementation((id: string) => {
      if (id === 'winnerId') return winner;
      if (id === 'loserId') return loser;
      return null;
    });
  
    await service.registerMatchResult('winnerId', 'loserId', false);
  
    expect(eventEmitterMock.emit).toHaveBeenCalledWith(
      'updated-ranking',
      expect.objectContaining({ id: 'winnerId', rank: 1200 }), // Correction ici
    );
    expect(eventEmitterMock.emit).toHaveBeenCalledWith(
      'updated-ranking',
      expect.objectContaining({ id: 'loserId', rank: 1100 }), // Correction ici
    );
  });
});
