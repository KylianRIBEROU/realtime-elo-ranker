import { PlayersService } from './players.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PlayerDto } from './player.dto';
import { Player } from '../db/models/player.model';

describe('PlayersService', () => {
  let service: PlayersService;
  let playerModelMock: any;
  let eventEmitterMock: any;
  let playerMockValue: any;

  beforeEach(() => {
    playerMockValue = { id: 'Kyks', rank: 1000 };

    playerModelMock = {
      create: jest.fn().mockResolvedValue(playerMockValue),
      findAll: jest.fn().mockResolvedValue([playerMockValue]),
      findByPk: jest.fn().mockImplementation((id) =>
        Promise.resolve(id === 'Kyks' ? playerMockValue : null)
      ),
    };

    eventEmitterMock = { emit: jest.fn() };

    service = new PlayersService(playerModelMock, eventEmitterMock);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a new player', async () => {
    const player = await service.create('Kyks');
    expect(player).toEqual(PlayerDto.fromValueSet(playerMockValue.id, playerMockValue.rank));
    expect(playerModelMock.create).toHaveBeenCalled();
    expect(eventEmitterMock.emit).toHaveBeenCalledWith('updated-ranking', expect.any(Object));
  });

  it('should return all players', async () => {
    const players = await service.findAll();
    expect(players).toEqual([playerMockValue]);
  });

  it('should return one player if found', async () => {
    const player = await service.findOne('Kyks');
    expect(player).toEqual(PlayerDto.fromValueSet(playerMockValue.id, playerMockValue.rank));
  });

  it('should return null if player not found', async () => {
    const player = await service.findOne('Unknown');
    expect(player).toBeNull();
  });

  it('should calculate default ranking', async () => {
    const rank = await service.calculateDefaultRanking();
    expect(rank).toBe(1000);
  });
});
