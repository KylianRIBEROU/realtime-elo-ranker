import { Test, TestingModule } from '@nestjs/testing';
import { RankingsService } from './rankings.service';
import { getModelToken } from '@nestjs/sequelize';
import { PlayerDto } from '../players/player.dto';
import { Player } from '../db/models/player.model';

describe('RankingsService', () => {
    let service: RankingsService;
    let playerModelMock: any;

    beforeEach(async () => {
        playerModelMock = {
            findAll: jest.fn().mockResolvedValue([
                { id: 'Kyks', rank: 1000 },
                { id: 'Alex', rank: 1200 },
                { id: 'Sam', rank: 1100 },
            ]),
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                RankingsService,
                { provide: getModelToken(Player), useValue: playerModelMock }, // 🔹 Utiliser une string pour éviter les erreurs Sequelize
            ],
        }).compile();

        service = module.get<RankingsService>(RankingsService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('getRankingsSortedByRank should return sorted players', async () => {
        const players = await service.getRankingsSortedByRank();
        expect(players).toEqual([
            PlayerDto.fromValueSet('Alex', 1200),
            PlayerDto.fromValueSet('Sam', 1100),
            PlayerDto.fromValueSet('Kyks', 1000),
        ]);
    });
    
});
